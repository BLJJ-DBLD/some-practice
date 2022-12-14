import React, { useState, useRef, useEffect } from 'react'
import schemaJson from './decomposeGoods.json'
import {
  Modal,
  Row,
  Col,
  Input,
  Button,
  Table,
  Tag
} from 'antd'
import SchemaForm from '../SchemaForm'

const { TextArea } = Input

export default function DecomposeGoods (props) {
  const formRef = useRef(null)
  const [isSaveModal, setIsSaveModal] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [tableData, setTableData] = useState([])
  const [formData, setFormData] = useState({})
  const [saveSelectedRowKeys, setSaveSelectedRowKeys] = useState([])
  const [saveTable, setSaveTable] = useState([])
  const handleAddGoods = () => {
    const lastId = tableData.length !== 0 ? tableData[tableData.length - 1].id + 1 : 0
    setTableData([
      ...tableData,
      {
        id: lastId,
        prevText: '',
        descText: ''
      }
    ])
  }
  const handleDelGoods = () => {
    const curTableData = [...tableData]
    const filteCurTableData = curTableData.filter((data) => !selectedRowKeys.includes(data.id))
    setTableData(filteCurTableData)
    setSelectedRowKeys([])
  }
  const handleDelSaveGoods = () => {
    const curTableData = [...saveTable]
    const filteCurTableData = curTableData.filter((data) => !saveSelectedRowKeys.includes(data.id))
    setSaveTable(filteCurTableData)
    setSaveSelectedRowKeys([])
  }
  const handleChangeTab = (e, index, key) => {
    const curTableData = [...tableData]
    const text = e.target.value
    curTableData[index][key] = text
    setTableData(curTableData)
  }
  const handleTabOk = () => {
    formRef.current.submit()
  }
  const handleSubmit = (formData, errors) => {
    if (errors.length) {return}
    const saveTableData = tableData.map((item, index) => {
      const curItem = {
        id: index,
        prevText: '',
        suffixText: '',
        descText: '',
        ...item,
        ...formData
      }
      curItem.name = curItem.prevText.trim().replace(/[\t\r\n]*/g, '') + curItem.suffixText.trim().replace(/[\t\r\n]*/g, '')
      curItem.desc = curItem.name + curItem.descText.trim().replace(/[\t\r\n]*/g, '')
      return curItem
    })
    setFormData(formData)
    setSaveTable(saveTableData)
    setIsSaveModal(true)
  }
  const handleSaveOk = () => {
    setIsSaveModal(false)
    props.onSuccess(saveTable)
  }
  const handleTabCancel = () => {
    props.onCancel()
  }
  const handleSaveCancel = () => {
    setIsSaveModal(false)
  }
  const columns = [
    {
      title: '??????',
      dataIndex: 'prevText',
      render: (_, {prevText}, index) => <Input placeholder="???????????????" value={prevText} onChange={(e) => handleChangeTab(e, index, 'prevText')} />
    }, {
      title: '????????????',
      dataIndex: 'descText',
      render: (_, {descText}, index) => <TextArea placeholder="?????????????????????" value={descText} rows={1} onChange={(e) => handleChangeTab(e, index, 'descText')} />
    }
  ]
  const saveColumns = [
    {
      title: '??????',
      dataIndex: 'name'
    }, {
      title: '????????????',
      dataIndex: 'goodsType',
      render: (text) => <Tag color="volcano">{text}</Tag>
    }, {
      title: '?????????',
      dataIndex: 'duraMax'
    }, {
      title: '????????????',
      dataIndex: 'needLevel'
    }, {
      title: '????????????',
      dataIndex: 'price'
    }, {
      title: '????????????',
      dataIndex: 'needConf',
      render: (_, {needConf}) => needConf.map((conf, index) => <Tag key={index} color="volcano">{conf}</Tag>)
    }, {
      title: '????????????',
      dataIndex: 'desc'
    }
  ]
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }
  const saveRowSelection = {
    selectedRowKeys: saveSelectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSaveSelectedRowKeys(selectedRowKeys)
    }
  }

  return (
    <div className='decompose-goods'>
      <Modal
        title="??????????????????"
        width="80%"
        okText="????????????"
        cancelText="??????"
        open={props.isOpen}
        onOk={handleTabOk}
        onCancel={handleTabCancel}>
        <Row gutter={24}>
          <Col span={14}>
            <Row justify="space-between">
              <Button onClick={handleAddGoods}>????????????</Button>
              <Button type="primary" danger disabled={selectedRowKeys.length === 0} onClick={handleDelGoods}>??????</Button>
            </Row>
            <Table
              rowKey="id"
              rowSelection={{
                type: 'checkbox',
                ...rowSelection
              }}
              pagination={{
                pageSize: 6
              }}
              columns={columns}
              dataSource={tableData} />
          </Col>
          <Col span={10}>
            <SchemaForm
              ref={formRef}
              data={formData}
              json={schemaJson}
              finish={handleSubmit}/>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="?????????????????????"
        width="80%"
        okText="??????"
        cancelText="??????"
        open={isSaveModal}
        onOk={handleSaveOk}
        okButtonProps={{ disabled: saveTable.length === 0 }}
        onCancel={handleSaveCancel}>
        <Button type="primary" danger disabled={saveSelectedRowKeys.length === 0} onClick={handleDelSaveGoods}>??????</Button>
        <Table
          rowKey="id"
          rowSelection={{
            type: 'checkbox',
            ...saveRowSelection
          }}
          pagination={{
            pageSize: 6
          }}
          columns={saveColumns}
          dataSource={saveTable} />
      </Modal>
    </div>
  )
}

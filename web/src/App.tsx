import { useState } from 'react'
import { Button, Layout, Menu, Card, Row, Col, Typography, Upload, Modal, Form, Input, Select, message, Spin } from 'antd'
import { FileTextOutlined, CheckCircleOutlined, UploadOutlined, SignatureOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import './App.css'

const { Header, Content } = Layout
const { Title, Paragraph } = Typography
const { Option } = Select

// 文件上传配置
const uploadProps = {
  name: 'file',
  multiple: false,
  accept: '.pdf,.jpg,.jpeg,.png',
  action: 'http://localhost:5000/ocr/recognize',
  headers: {},
  onChange(info: any) {
    const { status } = info.file
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`)
      // 处理OCR识别结果
      console.log('OCR识别结果:', info.file.response)
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败: ${info.file.error?.message || '未知错误'}`)
      console.error('上传错误详情:', info.file.error)
    }
  },
  beforeUpload(file: any) {
    const fileSize = file.size / 1024 / 1024 < 10
    if (!fileSize) {
      message.error('文件大小不能超过10MB')
    }
    return fileSize
  },
}

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<string>('createQuotation')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [contractContent, setContractContent] = useState<string>('')
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [quotationContent, setQuotationContent] = useState<string>('')
  const [isQuotationPreviewVisible, setIsQuotationPreviewVisible] = useState(false)
  const [quotations, setQuotations] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [reviewSuggestions, setReviewSuggestions] = useState<string>('')
  const [isReviewPreviewVisible, setIsReviewPreviewVisible] = useState(false)

  // 打开功能模态框
  const showModal = (type: string) => {
    setModalType(type)
    setIsModalVisible(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  // 合同生成功能
  const handleGenerateContract = async (templateType: string) => {
    setLoading(true)
    try {
      // 根据模板类型确定合同类型
      const contractType = templateType === 'purchase_contract' ? '采购合同' : '销售合同'
      
      const response = await axios.post('http://localhost:5000/contract/generate', {
        template_id: templateType,
        data: {
          seller: '供应商名称',
          buyer: '采购商名称',
          amount: 10000,
          productName: '产品名称',
          quantity: 10,
        },
      })
      message.success('合同生成成功')
      console.log('合同生成结果:', response.data)
      
      // 保存合同内容并打开预览模态框
      const contractContent = response.data.contract_content
      setContractContent(contractContent)
      setIsPreviewVisible(true)
      
      // 保存到合同列表
      const newContract = {
        id: Date.now(),
        type: contractType,
        content: contractContent,
        createDate: new Date().toLocaleDateString(),
        seller: '供应商名称',
        buyer: '采购商名称',
        productName: '产品名称',
        totalAmount: 10000 * 10
      }
      setContracts([...contracts, newContract])
    } catch (error) {
      message.error('合同生成失败')
      console.error('合同生成错误:', error)
    } finally {
      setLoading(false)
      handleCancel()
    }
  }

  // 合同审核功能
  const handleReviewContract = async (contractContent?: string, contractId?: number) => {
    setLoading(true)
    try {
      // 如果没有提供合同内容，则使用默认示例内容（用于模态框中的审核）
      const contentToReview = contractContent || '这是一份合同内容示例，包含采购条款和付款条件等信息...'
      
      const response = await axios.post('http://localhost:5000/contract/review', {
        contract_content: contentToReview,
      })
      message.success('合同审核完成')
      console.log('合同审核结果:', response.data)
      
      // 保存审核建议并打开预览模态框
      const suggestions = response.data.review_suggestions || '暂无审核建议'
      setReviewSuggestions(suggestions)
      setIsReviewPreviewVisible(true)
    } catch (error) {
      message.error('合同审核失败')
      console.error('合同审核错误:', error)
    } finally {
      setLoading(false)
      // 只有从模态框调用时才关闭模态框
      if (!contractContent && !contractId) {
        handleCancel()
      }
    }
  }

  // 电子签章功能
  const handleElectronicSignature = () => {
    setLoading(true)
    setTimeout(() => {
      message.success('电子签章完成')
      setLoading(false)
      handleCancel()
    }, 1500)
  }

  // 生成报价单内容
  const generateQuotationContent = (values: any) => {
    const totalAmount = values.quantity * values.unitPrice
    return `# 报价单

## 报价单编号：${'QUO' + Date.now().toString().slice(-8)}
## 创建日期：${new Date().toLocaleDateString()}

### 客户信息
客户名称：${values.customerName}
联系人：${values.customerContact}

### 产品信息
产品名称：${values.productName}
数量：${values.quantity} 件
单价：${values.unitPrice} ${values.currency}
总金额：${totalAmount} ${values.currency}

### 交货信息
交货日期：${values.deliveryDate}

### 备注
${values.remark || '无'}

### 报价有效期
自报价之日起30天内有效

### 联系方式
销售方：${values.salesName || '智合同平台'}
联系人：${values.salesContact || '销售经理'}
电话：${values.salesPhone || '400-123-4567'}
邮箱：${values.salesEmail || 'sales@smart-contract.ai'}
`
  }

  // 表单提交处理
  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('表单提交:', values)
      message.success('表单提交成功')
      if (modalType === 'createQuotation') {
        // 报价单创建逻辑
        const content = generateQuotationContent(values)
        setQuotationContent(content)
        setIsQuotationPreviewVisible(true)
        
        // 保存到报价单列表
        const newQuotation = {
          id: Date.now(),
          ...values,
          content,
          totalAmount: values.quantity * values.unitPrice,
          createDate: new Date().toLocaleDateString()
        }
        setQuotations([...quotations, newQuotation])
      } else if (modalType === 'generateContract') {
        // 获取选择的合同模板类型
        const templateType = values.contractTemplate || 'purchase_contract'
        handleGenerateContract(templateType)
      } else if (modalType === 'reviewContract') {
        handleReviewContract()
      } else if (modalType === 'electronicSignature') {
        handleElectronicSignature()
      }
    }).catch(() => {
      message.error('表单验证失败')
    })
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001529' }}>
        <div className="logo" style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', marginRight: '24px' }}>
          智合同 SmartContract
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ flex: 1, minWidth: 0, backgroundColor: '#001529' }}
          items={[
            { key: '1', label: '首页' },
            { key: '2', label: '采购合同' },
            { key: '3', label: '销售合同' },
            { key: '4', label: '知识库' },
            { key: '5', label: '系统设置' },
          ]}
        />
      </Header>
      <Content style={{ margin: '24px 16px 0' }}>
        <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
          <Title level={2}>欢迎使用智合同平台</Title>
          <Paragraph>
            智合同是一款面向企业采购与销售合同场景的智能协同平台，通过AI大模型驱动，实现从报价单到合同的智能生成、合规审核、跨端审批与电子盖章的全流程自动化。
          </Paragraph>

          <Title level={3}>核心功能</Title>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="采购合同" variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* 上传报价单 - 实际文件上传 */}
                  <Upload {...uploadProps}>
                    <Button type="primary" icon={<UploadOutlined />}>
                      上传报价单
                    </Button>
                  </Upload>
                  <Button icon={<FileTextOutlined />} onClick={() => showModal('generateContract')}>
                    生成采购合同
                  </Button>
                  <Button icon={<CheckCircleOutlined />} onClick={() => showModal('reviewContract')}>
                    智能审核
                  </Button>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="销售合同" variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('createQuotation')}>
                    创建报价单
                  </Button>
                  <Button icon={<FileTextOutlined />} onClick={() => showModal('generateContract')}>
                    生成销售合同
                  </Button>
                  <Button icon={<CheckCircleOutlined />} onClick={() => showModal('reviewContract')}>
                    智能审核
                  </Button>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="合同管理" variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button type="primary" icon={<SignatureOutlined />} onClick={() => showModal('electronicSignature')}>
                    电子签章
                  </Button>
                  <Button icon={<FileTextOutlined />}>
                    合同查询
                  </Button>
                  <Button icon={<CheckCircleOutlined />}>
                    审批流程
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 报价单管理区域 */}
          <Title level={3}>报价单管理</Title>
          <div style={{ marginBottom: '24px' }}>
            {quotations.length > 0 ? (
              <Card title={`共 ${quotations.length} 个报价单`} variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>报价单编号</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>客户名称</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>产品名称</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e8e8e8' }}>总金额</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>创建日期</th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotations.map((quotation, index) => (
                        <tr key={quotation.id} style={{ borderBottom: '1px solid #e8e8e8', '&:hover': { backgroundColor: '#fafafa' } }}>
                          <td style={{ padding: '12px' }}>{'QUO' + quotation.id.toString().slice(-8)}</td>
                          <td style={{ padding: '12px' }}>{quotation.customerName}</td>
                          <td style={{ padding: '12px' }}>{quotation.productName}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>{quotation.totalAmount} {quotation.currency}</td>
                          <td style={{ padding: '12px' }}>{quotation.createDate}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <Button 
                              size="small" 
                              onClick={() => {
                                setQuotationContent(quotation.content)
                                setIsQuotationPreviewVisible(true)
                              }}
                            >
                              查看
                            </Button>
                            <Button 
                              size="small" 
                              type="primary" 
                              style={{ marginLeft: '8px' }}
                              onClick={() => {
                                // 下载报价单功能
                                const blob = new Blob([quotation.content], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `报价单_${quotation.customerName}_${quotation.createDate.replace(/\//g, '-')}.md`
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                URL.revokeObjectURL(url)
                                message.success('报价单下载成功')
                              }}
                            >
                              下载
                            </Button>
                            <Button 
                              size="small" 
                              type="default" 
                              style={{ marginLeft: '8px', backgroundColor: '#e6f7ff', borderColor: '#91d5ff', color: '#1890ff' }}
                              onClick={() => {
                                // AI智能审核功能
                                handleReviewContract(quotation.content, quotation.id)
                              }}
                            >
                              AI智能审核
                            </Button>
                            <Button 
                              size="small" 
                              danger 
                              style={{ marginLeft: '8px' }}
                              onClick={() => {
                                // 删除报价单功能
                                setQuotations(quotations.filter(item => item.id !== quotation.id))
                                message.success('报价单删除成功')
                              }}
                            >
                              删除
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  暂无报价单，点击"创建报价单"按钮开始创建
                </div>
              </Card>
            )}
          </div>

          {/* 合同管理区域 */}
          <Title level={3}>合同管理</Title>
          <div style={{ marginBottom: '24px' }}>
            {contracts.length > 0 ? (
              <Card title={`共 ${contracts.length} 份合同`} variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>合同编号</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>合同类型</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>供应商</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>采购商</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>产品名称</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e8e8e8' }}>总金额(元)</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>创建日期</th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract, index) => (
                        <tr key={contract.id} style={{ borderBottom: '1px solid #e8e8e8', '&:hover': { backgroundColor: '#fafafa' } }}>
                          <td style={{ padding: '12px' }}>{'CON' + contract.id.toString().slice(-8)}</td>
                          <td style={{ padding: '12px' }}>{contract.type}</td>
                          <td style={{ padding: '12px' }}>{contract.seller}</td>
                          <td style={{ padding: '12px' }}>{contract.buyer}</td>
                          <td style={{ padding: '12px' }}>{contract.productName}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>{contract.totalAmount}</td>
                          <td style={{ padding: '12px' }}>{contract.createDate}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <Button 
                              size="small" 
                              onClick={() => {
                                setContractContent(contract.content)
                                setIsPreviewVisible(true)
                              }}
                            >
                              查看
                            </Button>
                            <Button 
                              size="small" 
                              type="primary" 
                              style={{ marginLeft: '8px' }}
                              onClick={() => {
                                // 下载合同功能
                                const blob = new Blob([contract.content], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `合同_${contract.type}_${contract.createDate.replace(/\//g, '-')}.md`
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                URL.revokeObjectURL(url)
                                message.success('合同下载成功')
                              }}
                            >
                              下载
                            </Button>
                            <Button 
                              size="small" 
                              type="default" 
                              style={{ marginLeft: '8px', backgroundColor: '#e6f7ff', borderColor: '#91d5ff', color: '#1890ff' }}
                              onClick={() => {
                                // AI智能审核功能
                                handleReviewContract(contract.content, contract.id)
                              }}
                            >
                              AI智能审核
                            </Button>
                            <Button 
                              size="small" 
                              danger 
                              style={{ marginLeft: '8px' }}
                              onClick={() => {
                                // 删除合同功能
                                setContracts(contracts.filter(item => item.id !== contract.id))
                                message.success('合同删除成功')
                              }}
                            >
                              删除
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card variant="outlined" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  暂无合同，点击"生成采购合同"或"生成销售合同"按钮开始创建
                </div>
              </Card>
            )}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', color: '#888' }}>
            <Paragraph>智合同平台 - 让合同管理更智能、更高效</Paragraph>
          </div>
        </div>
      </Content>

      {/* 功能模态框 */}
      <Modal
        title={
          modalType === 'createQuotation' ? '创建报价单' :
          modalType === 'generateContract' ? '生成合同' :
          modalType === 'reviewContract' ? '合同审核' :
          '电子签章'
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Spin spinning={loading} tip="处理中...">
          <Form form={form} layout="vertical" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {modalType === 'createQuotation' && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="customerName"
                      label="客户名称"
                      rules={[{ required: true, message: '请输入客户名称' }]}
                    >
                      <Input placeholder="请输入客户名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="customerContact"
                      label="联系人"
                      rules={[{ required: true, message: '请输入联系人' }]}
                    >
                      <Input placeholder="请输入联系人" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="productName"
                      label="产品名称"
                      rules={[{ required: true, message: '请输入产品名称' }]}
                    >
                      <Input placeholder="请输入产品名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="quantity"
                      label="数量"
                      rules={[{ required: true, message: '请输入数量' }]}
                    >
                      <Input type="number" placeholder="请输入数量" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="unitPrice"
                      label="单价"
                      rules={[{ required: true, message: '请输入单价' }]}
                    >
                      <Input type="number" placeholder="请输入单价" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="currency"
                      label="货币"
                      rules={[{ required: true, message: '请选择货币' }]}
                    >
                      <Select placeholder="请选择货币">
                        <Option value="CNY">人民币(CNY)</Option>
                        <Option value="USD">美元(USD)</Option>
                        <Option value="EUR">欧元(EUR)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="deliveryDate"
                  label="交货日期"
                  rules={[{ required: true, message: '请输入交货日期' }]}
                >
                  <Input placeholder="请输入交货日期，如：2025-12-31" />
                </Form.Item>
                <Title level={4} style={{ marginTop: '16px', marginBottom: '16px' }}>联系方式</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="salesName"
                      label="销售方"
                      initialValue="智合同平台"
                    >
                      <Input placeholder="请输入销售方名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="salesContact"
                      label="联系人"
                      initialValue="销售经理"
                    >
                      <Input placeholder="请输入联系人" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="salesPhone"
                      label="电话"
                      initialValue="400-123-4567"
                    >
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="salesEmail"
                      label="邮箱"
                      initialValue="sales@smart-contract.ai"
                    >
                      <Input placeholder="请输入联系邮箱" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="remark"
                  label="备注"
                >
                  <Input.TextArea rows={4} placeholder="请输入备注信息" />
                </Form.Item>
              </>
            )}

            {(modalType === 'generateContract' || modalType === 'reviewContract') && (
              <Form.Item
                name="contractTemplate"
                label="合同模板"
                rules={[{ required: true, message: '请选择合同模板' }]}
              >
                <Select placeholder="请选择合同模板">
                  <Option value="purchase_contract">采购合同模板</Option>
                  <Option value="sales_contract">销售合同模板</Option>
                  <Option value="service_contract">服务合同模板</Option>
                </Select>
              </Form.Item>
            )}

            {modalType === 'electronicSignature' && (
              <>
                <Form.Item label="合同信息">
                  <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <p><strong>合同编号:</strong> SC20251212001</p>
                    <p><strong>合同名称:</strong> 采购合同</p>
                    <p><strong>签署方:</strong> 供应商A ↔ 采购商B</p>
                    <p><strong>签署日期:</strong> 2025-12-12</p>
                  </div>
                </Form.Item>
                <Form.Item
                  name="signatory"
                  label="签署人"
                  rules={[{ required: true, message: '请选择签署人' }]}
                >
                  <Select placeholder="请选择签署人">
                    <Option value="user1">张三 (总经理)</Option>
                    <Option value="user2">李四 (法务经理)</Option>
                    <Option value="user3">王五 (采购经理)</Option>
                  </Select>
                </Form.Item>
              </>
            )}

            <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" onClick={handleSubmit} style={{ marginRight: '12px' }}>
                {modalType === 'createQuotation' ? '创建报价单' :
                 modalType === 'generateContract' ? '生成合同' :
                 modalType === 'reviewContract' ? '开始审核' :
                 '确认签章'}
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* 合同预览模态框 */}
      <Modal
        title="合同预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary"
            onClick={() => {
              // 下载合同功能
              const blob = new Blob([contractContent], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `合同_${new Date().toLocaleDateString().replace(/\//g, '-')}.md`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              message.success('合同下载成功')
            }}
          >
            下载合同
          </Button>,
        ]}
        width={800}
      >
        <div style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '16px', 
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          {contractContent || '暂无合同内容'}
        </div>
      </Modal>

      {/* 报价单预览模态框 */}
      <Modal
        title="报价单预览"
        open={isQuotationPreviewVisible}
        onCancel={() => setIsQuotationPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsQuotationPreviewVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary"
            onClick={() => {
              // 下载报价单功能
              const blob = new Blob([quotationContent], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `报价单_${new Date().toLocaleDateString().replace(/\//g, '-')}.md`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              message.success('报价单下载成功')
            }}
          >
            下载报价单
          </Button>,
        ]}
        width={800}
      >
        <div style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '16px', 
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          {quotationContent || '暂无报价单内容'}
        </div>
      </Modal>

      {/* 审核建议预览模态框 */}
      <Modal
        title="AI审核建议"
        open={isReviewPreviewVisible}
        onCancel={() => setIsReviewPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsReviewPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '16px', 
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          {reviewSuggestions || '暂无审核建议'}
        </div>
      </Modal>
    </Layout>
  )
}

export default App
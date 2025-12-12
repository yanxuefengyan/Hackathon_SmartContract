from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="智合同 AI Service",
    description="AI服务API，提供合同生成、OCR识别、智能审核等功能",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "智合同 AI Service is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Contract generation request model
class ContractRequest(BaseModel):
    template_id: str
    data: dict

# Contract generation endpoint
@app.post("/contract/generate")
def generate_contract(request: ContractRequest):
    """Generate contract based on template and data"""
    # 根据模板生成详细合同内容
    template_id = request.template_id
    data = request.data
    
    # 采购合同模板
    if template_id == "purchase_contract":
        contract_content = f"""# 采购合同

## 合同编号：{"PC" + "12345"}
## 签订日期：2025-12-12

### 甲方（采购方）
名称：{data.get('buyer', '采购商名称')}
地址：中国北京市朝阳区
联系人：张经理
电话：13800138000

### 乙方（供应商）
名称：{data.get('seller', '供应商名称')}
地址：中国上海市浦东新区
联系人：李经理
电话：13900139000

### 一、采购产品
产品名称：{data.get('productName', '产品名称')}
数量：{data.get('quantity', 10)} 件
单价：{data.get('amount', 10000)} 元
总金额：{data.get('amount', 10000) * data.get('quantity', 10)} 元

### 二、质量要求
1. 乙方提供的产品必须符合国家相关标准
2. 产品质保期：自交付之日起12个月
3. 如产品存在质量问题，乙方需在24小时内响应

### 三、交货时间与地点
1. 交货时间：合同签订后7个工作日内
2. 交货地点：甲方指定地点
3. 运输方式：乙方负责运输，运费由乙方承担

### 四、付款方式
1. 合同签订后3个工作日内，甲方支付30%预付款
2. 产品验收合格后7个工作日内，甲方支付70%尾款
3. 付款方式：银行转账

### 五、违约责任
1. 如甲方未按约定付款，每逾期一天，支付合同金额的0.1%作为违约金
2. 如乙方未按约定交货，每逾期一天，支付合同金额的0.1%作为违约金

### 六、争议解决
本合同履行过程中如发生争议，双方应友好协商解决；协商不成的，提交甲方所在地人民法院诉讼解决。

### 七、其他
1. 本合同一式两份，甲乙双方各执一份，具有同等法律效力
2. 本合同自双方签字盖章之日起生效
3. 本合同未尽事宜，可另行签订补充协议

甲方（采购方）：____________________
签字（盖章）：____________________
日期：2025-12-12

乙方（供应商）：____________________
签字（盖章）：____________________
日期：2025-12-12
"""
    
    # 销售合同模板
    elif template_id == "sales_contract":
        contract_content = f"""# 销售合同

## 合同编号：{"SC" + "12345"}
## 签订日期：2025-12-12

### 甲方（卖方）
名称：{data.get('seller', '供应商名称')}
地址：中国上海市浦东新区
联系人：李经理
电话：13900139000

### 乙方（买方）
名称：{data.get('buyer', '采购商名称')}
地址：中国北京市朝阳区
联系人：张经理
电话：13800138000

### 一、销售产品
产品名称：{data.get('productName', '产品名称')}
数量：{data.get('quantity', 10)} 件
单价：{data.get('amount', 10000)} 元
总金额：{data.get('amount', 10000) * data.get('quantity', 10)} 元

### 二、质量标准
1. 甲方提供的产品必须符合国家相关标准
2. 产品质保期：自交付之日起12个月
3. 如产品存在质量问题，甲方需在24小时内响应

### 三、交货与验收
1. 交货时间：合同签订后5个工作日内
2. 交货地点：乙方指定地点
3. 验收标准：按国家相关标准执行
4. 验收期限：乙方收到产品后3个工作日内完成验收

### 四、付款条款
1. 合同签订后3个工作日内，乙方支付20%预付款
2. 产品验收合格后10个工作日内，乙方支付80%尾款
3. 付款方式：银行转账

### 五、知识产权
1. 甲方保证所售产品不侵犯任何第三方知识产权
2. 如因产品知识产权问题引起纠纷，由甲方承担全部责任

### 六、保密条款
1. 双方应对本合同内容及履行过程中知悉的对方商业秘密保密
2. 保密期限：合同终止后5年

### 七、违约责任
1. 如乙方未按约定付款，每逾期一天，支付合同金额的0.1%作为违约金
2. 如甲方未按约定交货，每逾期一天，支付合同金额的0.1%作为违约金

### 八、争议解决
本合同履行过程中如发生争议，双方应友好协商解决；协商不成的，提交甲方所在地人民法院诉讼解决。

### 九、其他
1. 本合同一式两份，甲乙双方各执一份，具有同等法律效力
2. 本合同自双方签字盖章之日起生效
3. 本合同未尽事宜，可另行签订补充协议

甲方（卖方）：____________________
签字（盖章）：____________________
日期：2025-12-12

乙方（买方）：____________________
签字（盖章）：____________________
日期：2025-12-12
"""
    
    # 默认合同模板
    else:
        contract_content = f'''# 合同

合同编号：12345
签订日期：2025-12-12

基于模板：{template_id}

数据：{str(data)}

这是一份默认合同模板，包含基本的合同条款。
'''
    
    return {
        "success": True,
        "contract_id": "12345",
        "contract_content": contract_content,
        "data": data
    }

# OCR recognition endpoint
@app.post("/ocr/recognize")
async def recognize_ocr(file: UploadFile = File(...)):
    """Recognize text from image using OCR"""
    # Placeholder implementation
    return {
        "success": True,
        "filename": file.filename,
        "text": "Recognized text from OCR",
        "confidence": 0.95
    }

# Contract review request model
class ContractReviewRequest(BaseModel):
    contract_content: str

# Contract review endpoint
@app.post("/contract/review")
def review_contract(request: ContractReviewRequest):
    """Review contract for risks and compliance"""
    # Placeholder implementation
    return {
        "success": True,
        "risks": [
            {
                "type": "payment",
                "description": "Payment terms may be unfavorable",
                "severity": "medium",
                "suggestion": "Consider revising payment schedule"
            }
        ],
        "compliance": {
            "status": "compliant",
            "issues": []
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

import React from 'react';
import ReactDOM from 'react-dom';
import Tabel from './component/Tabel';
import _ from 'underscore';
import { Select , Form , Input , Button , Cascader , Col , Row , notification , Icon , Radio , Modal , message} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let uuid = 0;
let uuid_b = 0

function sendBaseAjax( url,data ,callback,method,type){
	if( method == undefined || method == ''){
		method = 'GET';
	}
	if( type == undefined || type == ''){
		type = 'json';
	}
	$.ajax({
		url : url,
		timeout: 10000,
		data:data,
		dataType: type,
		method:method,
		success : function(data){
			callback(data);
		}
	});
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

export class SearchText extends React.Component{

  	constructor(props){
        super(props);

        this.state={
        };
    }

	handleSubmit(e){
		let data = this.props.form.getFieldsValue();
		if (this.props.submit) {
			this.props.submit(data)
		}
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		return(
			<Form hideRequiredMark layout="inline" style={this.props.style}>
				<FormItem  label="viewName" >
					{getFieldDecorator('viewName')(
						<Input style={{ width: '93.5%' }}/>
					)}
				</FormItem>
				<FormItem  label="viewTitle" >
					{getFieldDecorator('viewTitle')(
						<Input style={{ width: '93.5%' }}/>
					)}
				</FormItem>
				<FormItem  label="source" >
					{getFieldDecorator('source')(
						<Input style={{ width: '93.5%' }}/>
					)}
				</FormItem>
				<FormItem >
					<Button type="primary" htmlType="submit" onClick={this.handleSubmit.bind(this)}  size="large" style={{marginLeft:50}}>搜索</Button>
				</FormItem>
			</Form>
		)
	}
}
const WrappedSearchText = Form.create()(SearchText);

export class AddAndAlert extends React.Component{

  	constructor(props){
        super(props);

        this.state={
        };
    }

    remove(k){
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add(){
        uuid_b++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid_b);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    fatherRemove(k){
        if (this.props.remove) {
            this.props.remove(k);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 3 },
            },
        };
        const formItemLayoutInline = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };
        const formItemLayoutF = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 9 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const formItemLayoutWithOutLabelF = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 12, offset: 9 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <Row key={index}>
                    <Col span={8}>
                        <FormItem
                            {...(index === 0 ? formItemLayoutF : formItemLayoutWithOutLabelF)}
                            label={index === 0 ? 'mapping' : ''}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`names-${k}-a`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                    required: true,
                                    message: "Please input passenger's name or delete this field.",
                                }]})(
                                <Input placeholder="passenger name" style={{ width: '100%', marginRight: 8 }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={16}>
                        <FormItem
                            {...formItemLayout}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`names-${k}-b`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "Please input passenger's name or delete this field.",
                                }]})(
                                <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
                            )}
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.remove(k)}
                            />
                        </FormItem>
                    </Col>
                </Row>
            );
        });
        let classnames = this.props.noRemove?{marginLeft:"70%",display:'none'}:{marginLeft:"70%"};
        return (
            <div style={{backgroundColor:'#eeeeee',padding:"20px",marginLeft:"8.3%",width:"80%",borderRadius:'5px'}}>
                <Row>
                    <Col span={3}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('columnName',{rules:[{required: true, message: '请输入columnName'}]})(
                                <Input style={{ width: '100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem {...formItemLayoutInline}  required={false} >
                            {getFieldDecorator('columnTitle',{rules:[{required: true, message: '请输入columnTitle'}]})(
                                <Input style={{ width: '100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('type',{rules:[{required: true, message: '请选择type'}]})(
                                <Select style={{ width: '100%'}}>
            					    <Option value="text">text</Option>
                                    <Option value="keyword">keyword</Option>
                                    <Option value="string">string</Option>
                                    <Option value="long">long</Option>
                                    <Option value="short">short</Option>
                                    <Option value="integer">integer</Option>
                                    <Option value="byte">byte</Option>
                                    <Option value="double">double</Option>
                                    <Option value="float">float</Option>
                                    <Option value="date">date</Option>
                                    <Option value="boolean">boolean</Option>
                                    <Option value="binary">binary</Option>
            				   </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('args',{rules:[{required: true, message: '请输入columnTitle'}]})(
                                <Input style={{ width: '100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('focus',{rules:[{required: true, message: '请选择focus'}]})(
                                <Select style={{ width: '100%'}}>
									<Option value="true">true</Option>
									<Option value="false">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('json',{rules:[{required: true, message: '请选择json'}]})(
                                <Select style={{ width: '100%'}}>
									<Option value="true">true</Option>
									<Option value="false">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('key',{rules:[{required: true, message: '请选择key'}]})(
                                <Select style={{ width: '100%'}}>
									<Option value="true">true</Option>
									<Option value="false">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('show',{rules:[{required: true, message: '请选择show'}]})(
                                <Select style={{ width: '100%'}}>
                                    <Option value="true">true</Option>
									<Option value="false">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('mapping')(
                                <Input placeholder="暂时不需要"  style={{ width: '100%'}} disabled/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            <Icon
                                style={classnames}
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.fatherRemove(this.props.index)}
                            />
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    }
}
const WrappedAddAndAlert = Form.create()(AddAndAlert);

export class RenderDelimit extends React.Component{

	constructor(props){
		super(props);

		this.isEdit = false;
		this.editCode = 0;

		this.headerData = [
			{name:"viewName",key:"viewName"},
			{name:"viewTitle",key:"viewTitle"},
			{name:"source",key:"source"},
			{name:"recordTitle",key:"recordTitle"},
			{name:"操作",key:"opt"}
		];

		this.state={
			bodyDate:[],
			pageCount:1,
			showAorB:"A",
			showViewName:false,
			visible:false,
			modalTitle:""
		};
	}

	search(data){
		let _this = this;
		let params = {
			name:data.viewName==undefined?"":data.viewName,
			title:data.viewTitle==undefined?"":data.viewTitle,
			source:data.source==undefined?"":data.source,
		}
		sendBaseAjax("http://192.168.1.253:8088/record/viewConfig/find",params,function(re){
			// alert(re.length)
			_this.setState({
				bodyDate:re,
				showAorB:"B"
			});
		})
	}

	editFn(arg){
		this.isEdit = true;
		this.editCode = arg;
		this.setState({
			visible:true,
			modalTitle:"编辑"
		});
		this.resetColumns();
		let data = this.state.bodyDate;
		let param = data[arg-1];
		const { form } = this.props;
		form.setFieldsValue({"recordTitle":param.recordTitle,"source":param.source,"viewName":param.viewName,"viewTitle":param.viewTitle});
		param.columns.map((v,k)=>{
			if (k>0) {
				this.add();
			}
		})
		setTimeout(()=>{
			param.columns.map((v,k)=>{
				this.refs[`and_${k}`].setFieldsValue({"columnName":v.columnName,
													"columnTitle":v.columnTitle,
													"type":v.type,
													"args":v.args,
													"focus":v.focus=="1"?"true":"false",
													"json":v.json=="1"?"true":"false",
													"key":v.key=="1"?"true":"false",
													"show":v.show=="1"?"true":"false"});
			})
		},100)
		this.setState({
			showViewName:true
		});
	}

	onClickPage(onPageNum){
		console.log(onPageNum)
	}

    remove(k){
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add(){
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

	resetColumns(){
		uuid = 0;
		const { form } = this.props;
		form.setFieldsValue({
			keys: [],
		});
	}

	onclickCancel(){
		this.isEdit = false;
		this.editCode = 0;
		this.props.form.resetFields();
		this.resetColumns();
		this.refs.and_0.resetFields();
		this.setState({
			showViewName:false
		});
	}

	addInfo(){
		this.setState({
			visible:true,
			modalTitle:"添加"
		});
	}

    handleSubmit(e) {
        let _this = this;
        e.preventDefault();
        // this.refs.and
        let arr = this.props.form.getFieldValue('keys');
        let flag_1,flag_2,flag_3;
        let params = {columns:[]};
        this.props.form.validateFields((err, values) => {
            flag_1 = !err;
            if (!err) {
                params.view = values.view;
                params.viewName = values.viewName;
                params.viewTitle = values.viewTitle;
                params.source = values.source;
                params.recordTitle = values.recordTitle;
            }
        });
        this.refs['and_0'].validateFields((err,val)=>{
            flag_2 = !err;
            let obj = {
                columnName:val.columnName,
                columnTitle:val.columnTitle,
                type:val.type,
                args:val.args,
                focus:val.focus?"1":"0",
                json:val.json?"1":"0",
                key:val.key?"1":"0",
                show:val.show?"1":"0",
                // mapping:val.mapping == undefined?"":val.mapping
            }
            if (!err) {
                params.columns.push(obj)
            }
        });
        if (arr.length >= 1) {
            let index = 0;
            for (let i=0;i<arr.length;i++){
                _this.refs[`and_${arr[i]}`].validateFields((err,val)=>{
                    flag_3 = !err;
                    let obj = {
                        columnName:val.columnName,
                        columnTitle:val.columnTitle,
                        type:val.type,
                        args:val.args,
                        focus:val.focus?"1":"0",
                        json:val.json?"1":"0",
                        key:val.key?"1":"0",
                        show:val.show?"1":"0",
                        // mapping:val.mapping == undefined?"":val.mapping
                    }
                    if (!err) {
                        params.columns.push(obj)
                    }
                });
                if (!flag_3) {
                    index ++
                }
            }
            if (index > 0) {
                flag_2 = false;
            }else{
                flag_2 = true;
            }
        }
        if (flag_1&&flag_2) {
			let str_param = {
				body:JSON.stringify(params)
			};
			let url = this.isEdit?"http://192.168.1.253:8088/record/viewConfig/replace":"http://192.168.1.253:8088/record/viewConfig/insert";
            sendBaseAjax(url,str_param,(re)=>{
				if (re == "ok") {
					let data = _this.state.bodyDate
					if (this.isEdit) {
						data[_this.editCode-1] = params;
					}else {
						data.push(params);
					}
					_this.setState({
						bodyDate:data,
						visible:false
					});
					_this.onclickCancel()
					message.success(`${_this.state.modalTitle}成功！`);
				}
            },"POST","text")
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const formItemLayoutBtn = {
            wrapperCol: {
                xs: { span: 12, offset: 12 },
                sm: { span: 8, offset: 2 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return <WrappedAddAndAlert key={k} ref={`and_${k}`} index={k} remove={this.remove.bind(this)}/>
        });
		let bodyDateObj = ["viewName","viewTitle","source",'recordTitle'];
		let classnamesA = {paddingLeft:"21%",display:this.state.showAorB=="A"?"block":"none"}
		let classnamesB = {display:this.state.showAorB=="B"?"block":"none"}
        return (
            <div>
				<WrappedSearchText style={classnamesA} submit={this.search.bind(this)}/>
				<div style={classnamesB}>
					<Tabel ref="tabel_one" nopage={true} noId={false} noOp={true} operating={["edit"]} editFn={this.editFn.bind(this)}  headerData={this.headerData} bodyDate={this.state.bodyDate} bodyDateObj={bodyDateObj} pageCount={this.state.pageCount} onClickPage={this.onClickPage.bind(this)}/>
	                <div style={{margin:"60px 0"}} className="form-group-separator"></div>
					<Button type="primary" onClick={this.addInfo.bind(this)} style={{width: "6%",height: "4%"}}>添加</Button>
					<Modal title={this.state.modalTitle} visible={this.state.visible} width="80%" footer={null} onCancel={()=>{this.onclickCancel();this.setState({visible:false})}}>
						<Form onSubmit={this.handleSubmit.bind(this)} >
		                    <FormItem {...formItemLayout} label="view" required={false}>
		                        {getFieldDecorator('view',{rules:[{required: true, message: '请输入view'}]})(
		                            <Input placeholder="please enter view..." style={{ width: '60%', marginRight: 8 }}/>
		                        )}
		                    </FormItem>
		                    <FormItem {...formItemLayout} label="viewName" required={false}>
		                        {getFieldDecorator('viewName',{rules:[{required: true, message: '请输入viewName'}]})(
		                            <Input placeholder="please enter viewName..." style={{ width: '60%', marginRight: 8 }} disabled={this.state.showViewName}/>
		                        )}
		                    </FormItem>
		                    <FormItem {...formItemLayout} label="viewTitle" required={false}>
		                        {getFieldDecorator('viewTitle',{rules:[{required: true, message: '请输入viewTitle'}]})(
		                            <Input placeholder="please enter viewTitle..." style={{ width: '60%', marginRight: 8 }}/>
		                        )}
		                    </FormItem>
		                    <FormItem {...formItemLayout} label="source" required={false}>
		                        {getFieldDecorator('source',{rules:[{required: true, message: '请输入source'}]})(
		                            <Input placeholder="please enter source..." style={{ width: '60%', marginRight: 8 }}/>
		                        )}
		                    </FormItem>
		                    <FormItem {...formItemLayout} label="recordTitle" required={false}>
		                        {getFieldDecorator('recordTitle',{rules:[{required: true, message: '请输入recordTitle'}]})(
		                            <Input placeholder="please enter recordTitle..." style={{ width: '60%', marginRight: 8 }}/>
		                        )}
		                    </FormItem>
		                    <Row>
		                        <Col span={2}> </Col>
		                        <Col span={22}>
		                            <div style={{backgroundColor:"#eeeeee",marginBottom:1,height:"50px",width:"87.3%",borderRadius:'5px',padding: '0 20px'}}>
		                                <Col span={3} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    columnName
		                                </Col>
		                                <Col span={3} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    columnTitle
		                                </Col>
		                                <Col span={3} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    type
		                                </Col>
		                                <Col span={3} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    args
		                                </Col>
		                                <Col span={2} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    focus
		                                </Col>
		                                <Col span={2} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    json
		                                </Col>
		                                <Col span={2} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    key
		                                </Col>
		                                <Col span={2} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    show
		                                </Col>
		                                <Col span={3} style={{textAlign: 'center',lineHeight: '50px'}}>
		                                    mapping
		                                </Col>
		                                <Col span={1}>
		                                </Col>
		                            </div>
		                        </Col>
		                    </Row>
		                    <WrappedAddAndAlert ref="and_0" noRemove={true}/>
		                    {formItems}
		                    <FormItem {...formItemLayoutBtn} style={{marginTop:"20px"}}>
		                        <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '60%' }}>
		                           <Icon type="plus" /> Add columns
		                        </Button>
		                    </FormItem>
		                    <FormItem {...formItemLayoutBtn} style={{marginTop:"20px"}}>
		    				    <Button type="primary" htmlType="submit">Submit</Button>
		    				</FormItem>
		                </Form>
					</Modal>
				</div>
            </div>
        );
    }
}
const WrappedRenderDelimit = Form.create()(RenderDelimit);

function initComponentC(){
	ReactDOM.render(
		<WrappedRenderDelimit />,
		document.getElementById("render-container")
	)
}

$(document).ready(function(){
	// initComponentA();
	initComponentC();
})

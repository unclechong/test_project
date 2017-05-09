import React from 'react';
import ReactDOM from 'react-dom';
import Tabel from './component/Tabel';
import _ from 'underscore';
import { Select , Form , Input , Button , Cascader , Col , Row , notification , Icon , Radio} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let uuid = 0;
let uuid_b = 0

function sendBaseAjax( url,data ,callback,method){
	if( method == undefined || method == ''){
		method = 'GET';
	}
	let ajaxObj = $.ajax({
		url : url,
		timeout: 10000,
		data:data,
		dataType: "json",
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
                                    <Option value="1">true</Option>
                                    <Option value="0">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('json',{rules:[{required: true, message: '请选择json'}]})(
                                <Select style={{ width: '100%'}}>
                                    <Option value="1">true</Option>
                                    <Option value="0">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('key',{rules:[{required: true, message: '请选择key'}]})(
                                <Select style={{ width: '100%'}}>
            					    <Option value="1">true</Option>
                                    <Option value="0">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('show',{rules:[{required: true, message: '请选择show'}]})(
                                <Select style={{ width: '100%'}}>
                                    <Option value="1">true</Option>
                                    <Option value="0">false</Option>
            				    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem {...formItemLayoutInline} required={false}>
                            {getFieldDecorator('mapping')(
                                <Input style={{ width: '100%'}}/>
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
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
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
                focus:val.focus,
                json:val.json,
                key:val.key,
                show:val.show,
                mapping:val.mapping == undefined?"":val.mapping
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
                        focus:val.focus,
                        json:val.json,
                        key:val.key,
                        show:val.show,
                        mapping:val.mapping == undefined?"":val.mapping
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
            console.log(params);
            let params = {};
            sendBaseAjax("http://192.168.1.253:8088/record/viewConfig/insert",params,function(re){
                console.log(re);
            },"POST")
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
            return ( <WrappedAddAndAlert key={k} ref={`and_${k}`} index={k} remove={this.remove.bind(this)}/>
            );
        });
        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem {...formItemLayout} label="view" required={false}>
                        {getFieldDecorator('view',{rules:[{required: true, message: '请输入view'}]})(
                            <Input style={{ width: '60%', marginRight: 8 }}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="viewName" required={false}>
                        {getFieldDecorator('viewName',{rules:[{required: true, message: '请输入viewName'}]})(
                            <Input style={{ width: '60%', marginRight: 8 }}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="viewTitle" required={false}>
                        {getFieldDecorator('viewTitle',{rules:[{required: true, message: '请输入viewTitle'}]})(
                            <Input style={{ width: '60%', marginRight: 8 }}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="source" required={false}>
                        {getFieldDecorator('source',{rules:[{required: true, message: '请输入source'}]})(
                            <Input style={{ width: '60%', marginRight: 8 }}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="recordTitle" required={false}>
                        {getFieldDecorator('recordTitle',{rules:[{required: true, message: '请输入recordTitle'}]})(
                            <Input style={{ width: '60%', marginRight: 8 }}/>
                        )}
                    </FormItem>
                    <Row>
                        <Col span={2}> </Col>
                        <Col span={22}>
                            <div style={{backgroundColor:"#eeeeee",marginBottom:1,height:"50px",width:"87.3%",borderRadius:'5px',padding: '0 20px'}}>
                                <Col span={3} style={{textAlign: 'center',lineHeight: '50px'}}>
                                    colunmName
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

            </div>
        );
    }
}
const WrappedRenderDelimit = Form.create()(RenderDelimit);

export class TagTabel extends React.Component{

	constructor(props){
		super(props);

		this.headerData = [
			{name:"viewName",key:"viewName"},
			{name:"viewTitle",key:"viewTitle"},
			{name:"source",key:"source"},
			{name:"columns",key:"columns"}
		];

		this.state={
			bodyDate:[],
			pageCount:1
		};
	}
	componentDidMount(){
		let _this = this;
		let param = {
			name:'test',
		}
		sendBaseAjax("http://192.168.1.253:8088/record/viewConfig/find",param,function(re){
            console.log(re);
			_this.setState({
				bodyDate:re,
			});
		})
	}

	editFn(arg){
		console.log(arg);
	}

	onClickPage(onPageNum){
		console.log(onPageNum)
	}

	render(){
		let bodyDateObj = ["viewName","viewTitle","source",'columns'];
		return(
            <div>
                <Tabel ref="tabel_one" noId={false} noOp={true} headerData={this.headerData} bodyDate={this.state.bodyDate} bodyDateObj={bodyDateObj} pageCount={this.state.pageCount} onClickPage={this.onClickPage.bind(this)}/>
                <div style={{margin:"60px 0"}} className="form-group-separator"></div>
            </div>
		)
	}
}

function initComponentA(){
	ReactDOM.render(
		<TagTabel />,
		document.getElementById("tabel-container")
	)
}

function initComponentC(){
	ReactDOM.render(
		<WrappedRenderDelimit />,
		document.getElementById("render-container")
	)
}

$(document).ready(function(){
	initComponentA();
	initComponentC();
})

import React from 'react';
import ReactDOM from 'react-dom';
import Tabel from './component/Tabel';
import _ from 'underscore';
import { Select , Form , Input , Button , Cascader , Col , Row , notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

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

export class TagTabel extends React.Component{
    constructor(props){
        super(props);

        this.headerData = [
            {name:"序号",key:"list_num"},
            {name:"标签组名称",key:"taggroup_name"},
            {name:"标签数量",key:"tag_count"},
            {name:"描述",key:"desc"},
            {name:"数据库",key:"database"},
            {name:"数据表",key:"data_table"},
            {name:"最后修改时间",key:"final_modify_time"},
            {name:"修改用户",key:"modify_user"},
            {name:"操作",key:"operating"}
        ];

        this.state={
			bodyDate:[],
			pageCount:1,
            optionToPage:{},
		};
	}

	componentDidMount(){
		let _this = this;
		sendBaseAjax("http://localhost:9999/supereye/grouplist_info",{page:"1"},function(re){
			_this.setState({
				bodyDate:re.data,
				pageCount:re.page_num
				// pageCount:5
			});
		})
	}

    componentWillReceiveProps(nextProps){
        if(nextProps.addData.data != undefined){
            this.setState({
                bodyDate: nextProps.addData.data,
                pageCount: nextProps.addData.page_num
            });
        }
    }

	editFn(arg){
		console.log(arg);
	}

	onClickPage(onPageNum){
        let _this = this;
        // let url = _this.isSearch?"/supereye/taggroupsearch":"/supereye/grouplist_info";
        let url = "/supereye/grouplist_info";
        var param = {
            page:onPageNum
        }
        // if(_this.isSearch){
        //     param.keyword = keyword;
        // }
        sendBaseAjax(url,param,function(re){
            _this.setState({
                bodyDate: re.data,
            });
        })
	}

    setActPage(num){
        this.refs.tabel_one.setCurrentPage(num);
    }

	render(){
		let bodyDateObj = ["id","tag_group_name","tag_num","tag_des","tag_data_database","tag_data_table","last_modify_time","user_name"]
		return(
			<Tabel ref="tabel_one" optionToPage={{}} headerData={this.headerData} noId={true} bodyDate={this.state.bodyDate} bodyDateObj={bodyDateObj} operating={["edit","bar-chart","remove"]} editFn={this.editFn.bind(this)} pageCount={this.state.pageCount} onClickPage={this.onClickPage.bind(this)}/>
		)
	}
}

export class PostForm extends React.Component{
    constructor(props){
        super(props);

        //所有表option
        this.data_table = {};
        //所有列option
        this.data_list = {};
        //所有主体option
        this.data_body = {};
        //选择数据库和数据表后的上送参数
        this.send_params = {};
        //选择的数据库字段
        this.database = "";

        this.state={
            database:[],
            data_table:[],
            data_list:[],
            data_body:[],
            send_params:{},
            repAddData:{},
		};
	}

	componentDidMount(){
		let show_data = $("#show_data").data("dashboard");
        let database = [];
        _.map(show_data,(item,key)=>{
            database.push(key);
            this.data_table[key] = [];
            this.data_list[key] = {};
            this.data_body[key] = {};
            this.send_params[key] = {};
            _.map(item,(val,k)=>{
                this.data_table[key].push(val.table);
                this.data_list[key][val.table] = val.col_n_list;
                this.data_body[key][val.table] = val.col_pr_list;
                this.send_params[key][val.table] = {table_id:val.table_id,hbase_tbl_name:val.hbase_tbl_name,par_name:val.par_name,map_tbl_name:val.map_tbl_name,col_num_dict:val.col_num_dict,table2:val.table2}
            })
        })
        this.setState({
            database: database,
        });
	}

	editFn(arg){
		console.log(arg);
	}

	onClickPage(onPageNum){
		console.log(onPageNum)
	}

    checkName(rule,value,callback){
        let str = value == undefined?"":value;
        let flag = str.indexOf("NaN");
        if(flag != -1){
            callback('名称格式不正确，切换数据表选择正确后再提交！');
        }else{
            callback();
        }
    }

    cancelOnclick(){
        this.props.form.resetFields();
        this.setState({
            data_table:[],
            data_list:[],
            data_body:[],
            send_params:{},
        });
    }

    handleSubmit(e){
        let _this = this;
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
    	    if (!err) {
                // new version is comming
                let data ={
                    tag_group_name:values.name,
                    status_code:"add",
                    main_data:values.data_body,
                    database:values.database,
                    table:values.data_table,
                    tag_des:values.depict,
                    col_name:values.data_list,
                }
                data.table_id = this.state.send_params.table_id;
                data.hbase_tbl_name = this.state.send_params.hbase_tbl_name;
                data.col_num_dict = this.state.send_params.col_num_dict_str;
                data.par_name = this.state.send_params.par_name;
                data.map_tbl_name = this.state.send_params.map_tbl_name;
                sendBaseAjax('/supereye/save_taggroup',data,function(re){
                    let col_count = Number(_this.send_params[values.database][values.data_table].col_num_dict[values.data_list])+1;
                    _this.send_params[values.database][values.data_table].col_num_dict[values.data_list] = String(col_count);

                    // if (re.data_count % 10 == 1) {
                    //
                    // }
                    _this.setState({
                        repAddData:re
                    });
                    _this.refs.tagTabel.setActPage(re.page_num);
                    _this.cancelOnclick();
                },"POST")
    		}
	    })
	}

    one_two_select_Onchange(index,val){
        if(index == 1){
            this.setState({
                data_list:this.data_list[this.database][val],
                data_body:this.data_body[this.database][val],
                send_params:this.send_params[this.database][val]
            },()=>{
                this.props.form.resetFields(['data_list','data_body','name']);
            });
        }else if(index == 0) {
            this.database = val;
            this.setState({
                data_table: this.data_table[val],
            },()=>{
                this.props.form.resetFields(['data_table','data_list','data_body','name']);
            });
        }else if (index == 2) {
            let send_params = this.state.send_params;
            let col_num_dict = "";
            _.map(send_params.col_num_dict,(num,name)=>{
                col_num_dict = `${col_num_dict}${Object.keys(send_params.col_num_dict).indexOf(name)==0?"":","}${name}:${val==name?Number(num)+1:num}`
            })
            send_params.col_num_dict_str = col_num_dict;
            this.setState({
                send_params: send_params
            });
            let index = Number(send_params.col_num_dict[val])+1;
            let setStr = `${send_params.table2}_${val}_${index}`;
            this.props.form.setFieldsValue({name:setStr});
        }
    }

	render(){
        const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
		    labelCol: {
				xs: { span: 24 },
				sm: { span: 3 },
		    },
		    wrapperCol: {
				xs: { span: 24 },
				sm: { span: 15 },
		    },
		};
		const formItemLayoutGroup = {
		    labelCol: {
				xs: { span: 24 },
				sm: { span: 9 },
		    },
		    wrapperCol: {
				xs: { span: 24 },
				sm: { span: 12 },
		    },
		};
		const tailFormItemLayout = {
		    wrapperCol: {
				xs: {
				    span: 24,
				    offset: 0,
				},
				sm: {
				    span: 14,
				    offset: 3,
				},
		    },
		};

        const databaseOptions = this.state.database.map(list => <Option key={list} value={list}>{list}</Option>);
        const datatableOptions = this.state.data_table.map(list => <Option key={list} value={list}>{list}</Option>);
        const datalistOptions = this.state.data_list.map(list => <Option key={list} value={list}>{list}</Option>);
        const databodyOptions = this.state.data_body.map(list => <Option key={list} value={list}>{list}</Option>);

		return(
            <div>
                <TagTabel ref="tagTabel" addData={this.state.repAddData}/>
                <div className="form-group-separator"></div>
                <Form hideRequiredMark style={{width:"90%"}} onSubmit={this.handleSubmit.bind(this)}>
                    <Row>
						<Col span={8}>
							<FormItem {...formItemLayoutGroup} label="数据表">
								{getFieldDecorator('database',{rules:[{required: true, message: '请选择'}]})(
									<Select
										showSearch
										style={{ width: '100%' }}
										placeholder="请选择"
										optionFilterProp="children"
                                        onChange={this.one_two_select_Onchange.bind(this,0)}
										filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>{databaseOptions}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={5}>
							<FormItem {...formItemLayoutGroup} wrapperCol={{sm:{span:18}}}>
								{getFieldDecorator('data_table',{rules:[{required: true, message: '请选择'}]})(
									<Select
										showSearch
										style={{ width: '100%' }}
										placeholder="请选择"
										optionFilterProp="children"
                                        onChange={this.one_two_select_Onchange.bind(this,1)}
										filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{datatableOptions}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={4}>
							<FormItem {...formItemLayoutGroup} labelCol={{sm:{span:0}}} wrapperCol={{sm:{span:24}}}>
                                {getFieldDecorator('data_list',{rules:[{required: true, message: '请选择'}]})(
    									<Select
    										showSearch
    										style={{ width: '100%' }}
    										placeholder="请选择"
    										optionFilterProp="children"
                                            onChange={this.one_two_select_Onchange.bind(this,2)}
    										filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    									>
    										{datalistOptions}
    									</Select>
    								)}
							</FormItem>
						</Col>
                        <Col span={7}></Col>
					</Row>
                    <FormItem {...formItemLayout} label="数据主体" >
                        {getFieldDecorator('data_body',{rules:[{required: true, message: '请选择'}]})(
                            <Select
                                showSearch
                                style={{ width: '26.5%',marginRight:"7%" }}
                                placeholder="请选择"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {databodyOptions}
                            </Select>
                        )}该字段用于指定表中的主体ID,例如客户id、产品id、企业id等
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称" >
                        {getFieldDecorator('name',{rules:[{ validator: this.checkName.bind(this)}]})(
                            <Input style={{ width: '93.5%' }} disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称" >
                        {getFieldDecorator('depict',{rules:[{required: true, message: '请输入描述'}]})(
                            <Input style={{ width: '93.5%' }}/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">确定</Button>
                        <Button style={{marginLeft:"20px"}} size="large" onClick={this.cancelOnclick.bind(this)}>取消</Button>
                    </FormItem>
                </Form>
            </div>
		)
	}
}
const WrappedPostForm = Form.create()(PostForm);

function initComponentA(){
	ReactDOM.render(
		<TagTabel />,
		document.getElementById("tabel-container")
	)
}

function initComponentC(){
	ReactDOM.render(
		<WrappedPostForm />,
		document.getElementById("render-container")
	)
}

$(document).ready(function(){
	// initComponentA();
	initComponentC();
})

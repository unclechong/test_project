import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import AddAndAlert from './component/AddAndAlert';
import Table from './component/Table';
import _ from 'underscore';
import { Select , Form , Input , Button , Cascader , Col , Row , notification , Radio , message} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function sendBaseAjax( url,data ,callback,method){
	if( method == undefined || method == ''){
		method = 'GET';
	}
	var ajaxObj = $.ajax({
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

//balabala yidui params
const group_id = GetQueryString("tag_group_id");
const json_data = $.parseJSON($("#json_data").attr("data-dashboard"));
let json_data_forlist = {};
_.map(json_data,(item,key)=>{
	json_data_forlist[key] = {name:item.comment,list:item.enum_value};
})
const save_json_data =$("#save_json_data").data("dashboard");
let globalSearch = false;

//format denfin_config to chinese show
let format_data = {
	rerurnOrStr:function(data,obj){
		var str_or = "";
		if(data.condition == "1"){
			var s1 = data.values[0]=="no_info"?"-∞":data.values[0];
			var s2 = data.values[1]=="no_info"?"+∞":data.values[1];
			str_or = str_or + obj[data.name].name + " : " + s1 + " - " + s2;
		}else if(data.condition == "3"){
			var str_or_in = "";
			for (var l=0;l<data.values.length;l++){
				var is_first = l == 0?"":"、";
				str_or_in = str_or_in + is_first + data.values[l];
			}
			str_or = str_or + obj[data.name].name + " : " + str_or_in;
		}else{
			str_or = str_or + obj[data.name].name + " : " + data.values;
		}
		return str_or = "( " + str_or + " )";
	},

	returnAndStr:function(strArr){
		var reStr = "";
		for (var o=0;o<strArr.length;o++){
			var isAndFirst = o == 0?"":" and ";
			var last_str = strArr[o].indexOf("or") == -1?strArr[o]:"{ " + strArr[o] + " }"
			reStr = reStr + isAndFirst + last_str;
		}
		return reStr;
	}
}

function re_format_data(params){
	var _this = this;
	var strArr = [];
	for(var p = 0;p<params.length;p++){
		var show_str = "";
		for (var k=0;k<params[p].length;k++) {
			var isOrFirst = k == 0?"":" or ";
		    show_str = show_str + isOrFirst + format_data.rerurnOrStr(params[p][k],json_data_forlist);
		}
		strArr.push(show_str);
	}
	return format_data.returnAndStr(strArr)
}

export class RenderDelimit extends Component{

	constructor(props){
		super(props);

		this.andDivTotal = 1;
		this.selectedData = [];

		this.state={
			selectedData:[],
			renderData:{and_1:{or_1:{value:{a:{str:""}}}}},
		};
	}

	AddAndAlert(){
		++ this.andDivTotal;
		var pushValue = this.state.renderData;
		pushValue[`and_${this.andDivTotal}`] = {or_1:{value:{a:{str:""}}}}
		this.setState({
			renderData:pushValue
		});
		this.refs.addAndAlert.setOrDivTotal(`and_${this.andDivTotal}`)
	}

	deleteArr(str){
		let index = this.selectedData.indexOf(str);
		this.selectedData.splice(index,1);
		this.setState({
			selectedData: this.selectedData
		});
	}

	onSelectCb(o,n){
		this.selectedData.push(n);
		if (o != "") {
			let index = this.selectedData.indexOf(o);
			this.selectedData.splice(index,1);
		}
		this.setState({
			selectedData: this.selectedData
		});
	}

	setRenderData(data,arg){
		//and_num  andDiv 总数
		this.andDivTotal = Object.keys(data).length;
		//清空第一个字段已选列表，全部变为可选状态！
		this.selectedData = arg;
		this.setState({
			selectedData:arg,
			renderData:data
		})
		/*
		设置ordiv总数，方便添加or_num标识，   
		or_num
		and_num
		统计并且和或者条件个数，++ 增长 忽略删除！1,2,3,4,5,6,7,8,9...
		*/
		this.refs.addAndAlert.editindSetDivTotal(data)
	}

	render(){
		let selectData = [];
		_.map(json_data,(item,key)=>{
			selectData.push(<Option key={key} ref={key} disabled={this.state.selectedData.indexOf(item.comment)!=-1?true:false} value={item.comment} data-type={item.is_enum_value} data-val={item.column_name} data-enum_value={item.enum_value}>{item.comment}</Option>)
		})
		return (
			<div>
				<AddAndAlert ref="addAndAlert" deleteArr={this.deleteArr.bind(this)} selectCb={this.onSelectCb.bind(this)} renderData={this.state.renderData} selectData={selectData}/>
				<span className="user_l_bq_click" onClick={this.AddAndAlert.bind(this)} style={{left: "6%",bottom: 18}}><a href="javascript:void(0)"><i className="fa fa-plus"></i> 并且</a></span>
			</div>
		)
	}
}

export class Tagtable extends Component{

	constructor(props){
		super(props);

		this.headerData = [
			{name:"序号",key:"list_num"},
			{name:"标签名称",key:"tag_name"},
			{name:"显示名称",key:"show_name"},
			{name:"定义",key:"definition"},
			{name:"状态",key:"status"},
			{name:"执行频率",key:"run_rate"},
			{name:"最后修改时间",key:"final_modify_time"},
			{name:"修改用户",key:"modify_user"},
			{name:"执行状态",key:"run_status"},
			{name:"操作",key:"operating"}
		];
        //编辑时所对应的ID
        this.isSearch = false;
        this.keyword = "";

		this.state={
			bodyDate:[],
			pageCount:1
		};
	}

	componentDidMount(){
		let _this = this;
		let param = {
			tag_group_id:group_id,
			page:"1"
		}
		sendBaseAjax("/supereye/taguser_info",param,function(re){
			_this.setState({
				bodyDate:re.data,
				pageCount:re.page_num
				// pageCount:5
			});
		})
	}

	setData(data,pageCount){
        this.setState({
            bodyDate:data,
            pageCount:pageCount
        });
	}

	cleanSearchProp(){
        globalSearch = false;
        this.keyword = "";
	}

	editFn(arg){
        let data = this.state.bodyDate;
        let editTagId = data[arg-1].id;
        let editPageNum = this.refs.table_one.getCurrentPage();
        if (data[arg-1].celery_status == "RUNNING") {
        	message.info("执行状态为“RUNNING”时不可编辑！")
        }else{
            if (this.props.editFn) {
            	this.props.editFn(data,editTagId,editPageNum)
            }
        }
	}

	onClickPage(onPageNum){
        let _this = this;
        let url = _this.isSearch?"/supereye/tagsearch":"/supereye/taguser_info";
        var param = {
        	tag_group_id:group_id,
            page:onPageNum
        }
        if(_this.isSearch){
            param.keyword = this.keyword;
        }
        sendBaseAjax(url,param,function(re){
            _this.setState({
                bodyDate: re.data,
            });
        })
	}

    deleteFn(arg){
        let _this = this;
        let data = this.state.bodyDate;
        let tag_id = data[arg-1].id;
        sendBaseAjax("/supereye/del_tag",{tag_group_id:group_id,tag_id:tag_id},function(re){
            let tag_total = data.length;
            let actPageNum = _this.refs.table_one.getCurrentPage();
            tag_total == 1?actPageNum==1?actPageNum=actPageNum:actPageNum=actPageNum-1:actPageNum=actPageNum;
            if (_this.isSearch) {
                actPageNum = 1;
            }
            sendBaseAjax("/supereye/taguser_info",{tag_group_id:group_id,page:actPageNum},function(re_in){
                _this.setState({
                    bodyDate: re_in.data,
                    pageCount:re_in.page_num
                });
                message.success("删除成功",5)
                //若为搜索状态，删除后进入第一页
                if (_this.isSearch) {
                    _this.refs.table_one.setCurrentPage(1);
                    _this.isSearch = false
                    _this.keyword = "";
                }else{
                    if (tag_total == 1) {
                        _this.refs.table_one.setCurrentPage(re_in.page_num);
                    }
                    //若删除的为编辑中的那条，删除后并清空数据
                    if (_this.editTagId == tag_id) {
                        _this.props.cancelOnclick();
                    }
                }
            })
        },"POST")
    }

    repeatFn(arg){
        let data = this.state.bodyDate;
        let tag_id = data[arg-1].id;
        let _this = this;
		sendBaseAjax("/supereye/upate_celery_status",{tag_id:tag_id},function(re){
			data[arg-1].celery_status = re.celery_status;
            _this.setState({
                bodyDate: data,
            });
            message.success("刷新成功",5)
		},"GET")
    }

    onSearch(){
        let _this = this;
        globalSearch = true;
        this.keyword = document.getElementById("keyword").value;
		let param = {
			tag_group_id:group_id,
			keyword:this.keyword,
			page:"1"
		}
        sendBaseAjax("/supereye/tagsearch",param,function(re){
            _this.setState({
                bodyDate: re.data,
                pageCount:re.page_num
            });
            _this.refs.table_one.setCurrentPage(1);
            document.getElementById("keyword").value = "";
        })
    }


	render(){
		let bodyDateObj = ["id","tag_name","show_user_name","defind_info","status","exec_hz","last_modify_time","modify_user","celery_status"]
		return(
			<div>
                <div className="panel-heading">
                    <h4 className="panel-title pull-left">标签列表</h4>
                    <div className="pull-right tag_search tag_search_set">
                        <div className="input-group">
                            <input type="text" id="keyword" className="form-control no-right-border form-focus-purple" />
                            <span className="input-group-btn">
                                <button className="btn btn-primary btn-sm" type="button" onClick={this.onSearch.bind(this)}>搜索</button>
                            </span>   &nbsp;
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="well well-sm well-pagination"></div>
				<Table ref="table_one" headerData={this.headerData} noId={true} bodyDate={this.state.bodyDate} bodyDateObj={bodyDateObj} operating={["edit","repeat","remove"]} editFn={this.editFn.bind(this)} repeatFn={this.repeatFn.bind(this)} deleteFn={this.deleteFn.bind(this)} pageCount={this.state.pageCount} onClickPage={this.onClickPage.bind(this)}/>
			</div>
		)
	}
}

export class FormAndTable extends Component{

	constructor(props){
		super(props);

		this.state={

		};
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 2 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 15 },
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
					offset: 2,
				},
			},
		};
		return (
			<div>
				<Form hideRequiredMark style={{width:"90%"}}>
					<FormItem {...formItemLayout} label="标签名称" >
						{getFieldDecorator('tag_name',{rules:[
							{pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/ , message: '由英文、数字、下划线组成并且首位为英文，需符合标签定义规范，建表时作字段名称使用，具有唯一性'},
							{required: true, message: '请输入标签名称'}]})(
							<Input style={{ width: '93.5%' }}/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="显示名称" >
						{getFieldDecorator('show_name',{rules:[{required: true, message: '请输入显示名称'}]})(
							<Input style={{ width: '93.5%' }}/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="状态" style={{marginBottom:0}}>
					    {getFieldDecorator('status',{rules:[{required: true, message: '请选择状态'}]})(
							<RadioGroup>
							    <Radio value="1">永久有效</Radio>
								<Radio value="-1">失效</Radio>
								<Radio value="0" disabled>自定义&nbsp;&nbsp;
									<span style={{display:"none"}}>
										<Select
											defaultValue="jack"
											style={{ width: '40%' }}
											placeholder="选择一"
										>
											<Option value="jack">创建时间</Option>
											<Option value="lucy">当前时间</Option>
										</Select> ~ &nbsp;
										<Select
											defaultValue="jack"
											style={{ width: '40%' }}
											placeholder="选择二"
										>
											<Option value="jack">1个月后</Option>
											<Option value="lucy">3个月后</Option>
											<Option value="tom">6个月后</Option>
											<Option value="aaaa">永久</Option>
											<Option value="bbbb">自定义</Option>
										</Select>
									</span>
								</Radio>
							</RadioGroup>
					    )}
					</FormItem>
					<FormItem {...formItemLayout} label="执行频率" >
						{getFieldDecorator('run_time',{rules:[{required: true, message: '请选择执行频率'}]})(
							<RadioGroup>
								<Radio value="day">每日</Radio>
								<Radio value="week">每周</Radio>
								<Radio value="month">每月</Radio>
							</RadioGroup>
						)}
					</FormItem>
				</Form>
			</div>
		)
	}
}
const WrappedFormAndTable = Form.create()(FormAndTable);

export class CommonComponent extends Component{

	constructor(props){
		super(props);

		this.status = {
			"永久有效":"1",
			"失效":"-1",
			"自定义":"0"
		}
		this.run_time = {
			"每日":"day",
			"每周":"week",
			"每月":"month"
		}
		this.paramsList = {
			prop:{
				'1':"interval",
				'2':"include",
				"3":"equal"
			},
			vary:{
				"1":"cRate",
				"2":"cVlaue",
				"3":"range",
				"4":"vChange"
			},
			count:{
				"1":"sum",
				"2":"mean"
			}
		}
		this.changeList = {
			interval:"1",
			include:"2",
			equal:"3",
			cRate:"1",
			cVlaue:"2",
			range:"3",
			vChange:"4",
			sum:"1",
			mean:"2",
		}
        this.editTagId = "";
        this.editPageNum = "";

		this.state={
			editMode:false
		};
	}

	editFn(data,id,num){
		//set form value
		let _this = this;
		this.setState({
			editMode:true
		})
        this.editTagId = id;
        this.editPageNum = num;
		this.refs.fromList.setFieldsValue({"tag_name":data.tag_name,"show_name":data.show_user_name,"status":this.status[data.status],"run_time":this.run_time[data.exec_hz]});
		// let for_list = JSON.parse(data.defind_config);
		let for_list = [
		    [
		        {
		            "name": "netasset_debit_scale",
		            "type": "prop",                      //prop-属性;vary-变化;count-统计
		            "condition": "1",                    //1,2,3,4
		            "values": ['1','2'],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		        {
		            "name": "close_stock_day",
		            "type": "prop",                      //prop-属性;vary-变化;count-统计
		            "condition": "2",                    //1,2,3,4
		            "values": "2222",                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		        {
		            "name": "interest_year",
		            "type": "vary",                      //prop-属性;vary-变化;count-统计
		            "condition": "1",                    //1,2,3,4
		            "values": ["33",'55'],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		        {
		            "name": "asset_debit_scale",
		            "type": "vary",                      //prop-属性;vary-变化;count-统计
		            "condition": "2",                    //1,2,3,4
		            "values": ["33",'55'],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		        {
		            "name": "avg_asset_year",
		            "type": "vary",                      //prop-属性;vary-变化;count-统计
		            "condition": "3",                    //1,2,3,4
		            "values": ["33",'55'],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		        {
		            "name": "init_date",
		            "type": "vary",                      //prop-属性;vary-变化;count-统计
		            "condition": "4",                    //1,2,3,4
		            "values": [['1'],['1','2']],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		    ],
		    [
		        {
		            "name": "total_max_quota",
		            "type": "count",                      //prop-属性;vary-变化;count-统计
		            "condition": "1",                    //1,2,3,4
		            "values": ['2','naoxin'],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		        {
		            "name": "close_fin_day",
		            "type": "count",                      //prop-属性;vary-变化;count-统计
		            "condition": "2",                    //1,2,3,4
		            "values": ['2','naoxin'],                       //一个字段为字符串;区间为[10,20]
		            "date": ['20170505','20170510']          //区间 [20170505,20170510]
		        },
		    ],
		]
		let render_data = {};
		let selectedData_in = [];
		_.map(for_list,(item,index)=>{
			render_data[`and_${index+1}`] = {};
			_.map(item,(val,key)=>{
				let {name,type,condition,values,date} = val;
				let str = json_data[name].comment;
				let flag = json_data[name].is_enum_value;
				let arr = json_data[name].enum_value;
				let c_val = _this.paramsList[type][condition];
				let d_val = {};
				if (c_val == "include" ||c_val == "equal") {
					d_val.a = values;
				}else if(c_val == "interval"){
					d_val.a = values[0];
					d_val.b = values[1];
				}else{
					d_val.a = values[0];
					d_val.b = values[1];
					d_val.c = date;
				}
				selectedData_in.push(str);
				render_data[`and_${index+1}`][`or_${key+1}`] = {
					value:{
						a:{
							val:name,
							str:str,
							flag:flag,
							arr:arr
						},
						b:type,
						c:c_val,
						d:d_val
					}
				}
			})
		})
		this.refs.renderDelimit.setRenderData(render_data,selectedData_in);
	}

	cancelOnclick(){
        this.refs.fromList.resetFields();
        this.setState({
            editMode:false,
        });
        this.refs.renderDelimit.setRenderData({and_1:{or_1:{value:{a:{str:""}}}}},[]);
        this.editTagId = "";
        this.editPageNum = "";	
    }

	checkparamisnull(arg){
	    if($.trim(arg)==""){
	    	return "no_info"
	    }else{
	    	return arg
	    }
	}

	handleSubmit(RUN,e){
		e.preventDefault();
		let _this = this;
        this.refs.fromList.validateFields((err, values) => {
            if (!err) {
            	console.log(this.refs.renderDelimit.refs.addAndAlert.state.renderData);
            	let data = this.refs.renderDelimit.refs.addAndAlert.state.renderData;
            	let params_arr = [];
            	let entry = true;
            	let goNewPOST = false;
            	let data_key_arr = Object.keys(data);
				outerloop:
				for(let i=0;i<data_key_arr.length;i++){
					params_arr.push([])
					let data_in = data[data_key_arr[i]];
					let data_in_key_arr = Object.keys(data_in);
				    for(let j=0; j<data_in_key_arr.length; j++){
	    				let {value:{a,b,c,d}} = data_in[data_in_key_arr[j]];
            			if (a==undefined||b==undefined||c==undefined||d==undefined) {
            				entry = false
            				break outerloop
            			}
            			if (b!="prop") goNewPOST = true
            			let _values = c!="include"?[_this.checkparamisnull(d.a),_this.checkparamisnull(d.b)]:$.trim(d.a);
            			params_arr[i].push({
            				name:a.val,
            				type:b,
            				condition:_this.changeList[c],
            				values:_values,
            				date:b!="prop"?d.c:[]
            			})
            			if (typeof _values == 'object') {
            				if (_values[0] == "no_info" && _values[1] == "no_info") {
	            				entry = false
	            				break outerloop
            				}
            			}else{
            				if (_values == "") {
	            				entry = false
	            				break outerloop
            				}
            			}
				    }
				}
				if (!entry){
					message.error("请将定义字段填写完整");
				}else{
	            	let {database,main_data_type,table,tag_group_name,tag_main_data,col_name,hbase_tbl_name,par_name,map_tbl_name} = save_json_data;
	            	let params = {
	            		tag_name:values.tag_name,
	            		show_user_name:values.show_name,
	            		status:values.status,
	            		exec_hz:values.run_time,
	            		tag_group_id:group_id,
	            		database:database,
	            		main_data_type:main_data_type,
						table:table,
						tag_group_name:tag_group_name,
						tag_main_data:tag_main_data,
						col_name:col_name,
						hbase_tbl_name:hbase_tbl_name,
						par_name:par_name,
						map_tbl_name:map_tbl_name,
						status_code:"add",
						defind_config:params_arr,
						defind_info:re_format_data(params_arr),
						is_exec:"0",              //是否保存
						is_fuck:"1"
	            	}
					if(_this.state.editMode){
						params.status_code = "edit";
						params.tag_id = _this.editTagId;
					}
					if(RUN){
						params.is_exec = "1";
					}
					//如果为混合定义，走新接口
					if (goNewPOST) {
						params.is_fuck = "0";
					//若定义都为属性，走旧接口
					}
					// http://192.168.1.131/supereye/save_taguser
	            	sendBaseAjax('http://192.168.1.132:9009/supereye/save_taguser',JSON.stringify(params),function(re){
	                    if (_this.state.editMode) {
	                        //编辑模式
	                        let arg = {
								tag_group_id:group_id,
								page:"1"
							}
	                        if (globalSearch) {
	                            arg.page = 1;
	                        }
	                        sendBaseAjax("/supereye/taguser_info",arg,function(re_in){
	                        	_this.refs.table.setData(re_in.data,re_in.page_num);
	                            message.success("编辑成功",5)
	                        })
	                        if (globalSearch) {
	                            _this.refs.table.refs.table_one.setCurrentPage(1);
	                            _this.refs.table.cleanSearchProp();
	                        }else{
	                            _this.refs.table.refs.table_one.setCurrentPage(_this.editPageNum);
	                        }
	                    }else{
	                        _this.refs.table.setData(re.data,re.page_num);
	                        message.success("添加成功",5)
	                        _this.refs.table.refs.table_one.setCurrentPage(re.page_num);
	                    }
	                    _this.cancelOnclick();
	            	},'POST')
				}
            }
        });
	}

	render(){
		return(
			<div>
	            <Tagtable ref="table" editFn={this.editFn.bind(this)} cancelOnclick={this.cancelOnclick.bind(this)}/>
	            <div className="form-group-separator"></div>
	            <div className="tag_name">
	                <WrappedFormAndTable ref="fromList" />
					<div className="form-group user_dy">
						<label className="col-sm-1 control-label " style={{color:"#595959",fontWeight: 'normal',width:"7%"}}>定义</label>
						<RenderDelimit ref="renderDelimit" />
					</div>
					<div style={{margin:"0 0 30px 130px"}}>
						<Button size="large" type="primary" onClick={this.handleSubmit.bind(this,true)}>保存</Button>
						<Button style={{marginLeft:20}} size="large" onClick={this.cancelOnclick.bind(this)}>取消</Button>
						<Button style={{marginLeft:20}} size="large" type="primary" onClick={this.handleSubmit.bind(this,false)}>保存并继续添加</Button>
					</div>
	            </div>
			</div>
		)
	}
}

function initComponentA(){
	ReactDOM.render(
		<CommonComponent />,
		document.getElementById("container")
	)
}

$(document).ready(function(){
	initComponentA();
})

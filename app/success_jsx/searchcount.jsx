import {Component} from 'react';
import ReactDOM from 'react-dom';
import {Nav , NavItem} from 'react-bootstrap';
import _ from "underscore"
import ReactEcharts from 'echarts-for-react';
import Runcondition from './component/Runcondition';
import { Select , Form ,Row , Col , DatePicker , Button , Modal , Radio , Input , message , Checkbox , Table } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

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

export class RenderEcharts extends Component{

  	constructor(props){
        super(props);

        this.state={
        	echartsOption:this.props.type,
        	plainOptions:[],
        	indeterminate:false,
        	checkedList: [],
        	checkAll: true,
        };
    }

    returnData(data,type){
    	let show_name_list = [];
		let show_data = [];
		_.map(data,(val,key)=>{
			show_name_list.push(val[0]);
			if (type == "pie") {
				show_data.push({value:val[1],name:val[0]})
			}else{
				show_data.push(val[1])
			}
		})
		let op = {};
		if(type == "pie"){
			op = {
			    title : {
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    xAxis:false,
			    yAxis:false,
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data: show_name_list
			    },
			    series : [
			        {
			            name: '访问来源',
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data:show_data,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
		}else{
			op = {
			    title : {
			        x:'center'
			    },
			    color: ['#c35652'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : show_name_list,
			            axisTick: {
			                alignWithLabel: true
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'访问来源',
			            type:'bar',
			            barWidth: '60%',
			            data:show_data
			        }
			    ]
			};
		}
		return op
    }

	changeEcharts(type){
		this.refs.echarts.getEchartsInstance().clear();
		this.setState({
			echartsOption:type
		})
	}

    AllBoxOnChange(e){
	    this.setState({
	        indeterminate: false,
	        checkAll: e.target.checked,
	    },()=>{
	    	if (this.props.changeSelect) {
		    	this.props.changeSelect(e.target.checked?this.props.checkboxData:[]);
		    }
	    })
    }

    singleBoxOnChange(checkedList){
	    this.setState({
	        indeterminate: !!checkedList.length && (checkedList.length < this.props.checkboxData.length),
	        checkAll: checkedList.length === this.props.checkboxData.length,
	    });
	    if (this.props.changeSelect) {
	    	this.props.changeSelect(checkedList);
	    }
    }

    render(){
		return(
			<div>
		        <div style={{backgroundColor:"#ddd",paddingTop:20,width: '98%',height:390,margin: '0 auto',borderRadius:5,position:'relative'}}>
		        	<ReactEcharts ref="echarts" option={this.returnData(this.props.data,this.state.echartsOption)} style={{height: '350px',  width: '85%',margin:"0 20px 20px 20px",display:"inline-block"}} />
		        	<div style={{height:100,width:200,display:"inline-block",verticalAlign: 'top',padding:'50px 30px',display:"inline-block",position: 'absolute',right:50}}>
				        <Button type="primary" icon="pie-chart" style={{ height: 50,width: 50}} onClick={this.changeEcharts.bind(this,"pie")}/>
				        <Button type="primary" icon="bar-chart" onClick={this.changeEcharts.bind(this,"line")} style={{ marginLeft:5,height: 50,width: 50}}/>
		        	</div>
		        </div>
				<div style={{height: 1,width: '98%',backgroundColor: '#ddd',margin: '0 auto',marginBottom:20,marginTop:20}}></div>
				<Row style={{paddingLeft:20,marginBottom:20}}>
					<Col span={2}>
				        <Checkbox 
				            indeterminate={this.state.indeterminate}
				            onChange={this.AllBoxOnChange.bind(this)}
				            checked={this.state.checkAll}
				        >
				            全部
				        </Checkbox>
					</Col>
					<Col span={22}>
						<CheckboxGroup options={this.props.checkboxData} value={this.props.selectedTableData} onChange={this.singleBoxOnChange.bind(this)} />
					</Col>
				</Row>
		    </div>    
		)
    }
}

export class Selectgroup extends Component{

  	constructor(props){
        super(props);

        this.show_data = JSON.parse($("#show_data").attr("data-dashboard"));
        this.tag_data = {};
        this.cun_info = 0;
        this.renderData = "";
        this.selectPropList = [];
        this.save_form_data_1 = {};
        this.save_form_data_2 = {};

        this.state={
   			nowDate:"",
   			modalShow:false,
            tag_group_name:[],
            database:[],
            tables:[],
            propObj:[],
            visible:false,
            radioValue:"a",
            inputValue:"",
            echartsOption:"",
            echartsShow:false,
            renderData:"",
            //ture 不可输入
            colType:true,
            //是否选择正态分布
            isNorm:false
        };
    }

    componentDidMount(){
		let tag_data = JSON.parse($("#tag_data").attr("data-dashboard"));
        const tag_group_name = [];
        _.map(tag_data,(item,key)=>{
        	this.tag_data[item.tag_group_name] = {database:item.tag_database,groupName:item.tag_group_name,table:item.map_tbl_name,send_list:item.all_col}
        	tag_group_name.push(<Option key={item.tag_group_name} value={item.tag_group_name}>{item.tag_group_name}</Option>)
        })
        let database = [];
        _.map(this.show_data,(list,key)=>{
        	database.push(<Option key={key} value={key}>{key}</Option>)
        })
        this.setState({
        	tag_group_name:tag_group_name,
        	database:database,
        })
    }

    // componentWillReceiveProps(nextProps){
    // 	if (this.props.replaceType != nextProps.replaceType) {
    // 		// this.set
    // 		console.log('122222222')
    // 		// this.setState({
    // 		// 	echartsShow:false
    // 		// })
    // 	}
    // }

    componentDidUpdate(nextProps){
    	if (this.props.replaceType != nextProps.replaceType) {
			this.props.form.setFieldsValue(this[`save_form_data_${this.props.replaceType}`]); 
    	}
    }

	handelSubmit(){
		let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
            	let data = this.tag_data[values.groupName];
            	let params = {};
            	let list = [];
            	if(this.props.replaceType==2){
            		params.database = values.database;
            		params.table = values.table;
            		params.tag_group_name = values.prop;
            		params.cun_info = _this.cun_info;
            		params.way = this.state.colType?"":values.way2;
            		list = this.selectPropList;
            	}else{
            		params.database = data.database;
            		params.table = data.table;
            		params.tag_group_name = data.groupName;
            		params.way = "";
            		list = data.send_list;
            		// params.cun_info = "10"
            	}
            	console.log(params)
            	if (this.props.replaceType==2 && _this.cun_info == 0 && !_this.state.colType && !_this.state.isNorm) {
            		message.error("请先设置分段再提交",3);
            	}else{
					sendBaseAjax("/supereye/search_map_table",{data:JSON.stringify(params)},function(re){
				        _this[`save_form_data_${_this.props.replaceType}`] = values;
						if (_this.props.getData) {
							_this.props.getData(re,params,list);
						}
					})
            	}
            }
        });
	}

	toggleModal(){
		this.setState({
			visible:true
		})
	}

	handleCancel(){
		this.setState({
			visible:false
		})
	}

	databaseChange(val){
		let tables = [];
		_.map(this.show_data[val],(item,key)=>{
			tables.push(<Option key={key} value={item.table}>{item.table}</Option>)
		})
		this.setState({
			tables:tables
		},this.props.form.resetFields(["table","prop"]))
	}

	tableChange(val){
		let _this = this;
		let database = this.props.form.getFieldValue("database");
		let propObj = [];
		sendBaseAjax("/supereye/attributes_name",{database:database,table:val},function(re){
			_this.selectPropList = Object.keys(re);
			_.map(re,(item,key)=>{
				propObj.push(<Option key={key} value={item.column_name}>{item.comment}</Option>)
			})
			_this.setState({
				propObj:propObj,
			},_this.props.form.resetFields(["prop"]));
		})
	}

	tableChange2(val){
		let _this = this;
		let {database,table} = this.props.form.getFieldsValue();
		let params = {
			database:database,
			table:table,
		    col:val
		}
		sendBaseAjax("/supereye/double_way",params,function(re){
			_this.setState({
				colType:re.type=="NOTContinuous"?true:false
			})
			_this.props.form.resetFields(["way2"])
		})
	}

	selectTypeOnChange(val){
		this.setState({
			isNorm:val == "norm"?true:false
		})
	}

	renderComponent(type){
		const { getFieldDecorator } = this.props.form;
		if (type == 1) {
			return(
				<div>
	      			<Col span={4}>
	                    <FormItem >
	                        {getFieldDecorator('groupName',{rules:[{required: true, message: '请选择标签组名称'}]})(
	                            <Select style={{width:"90%"}} placeholder="请选择标签组名称">
									{this.state.tag_group_name}
	        				    </Select>
	                        )}
	                    </FormItem>
	                </Col>
	            	<Col span={4}>
	                    <FormItem>
				            {getFieldDecorator('date-picker1')(
				                <DatePicker style={{width:"90%"}} />
				            )}
				        </FormItem>
	                </Col>
				</div>
			)
		}else if(type == 2){
			let flag = this.state.colType?false:true;
			let btnDieabled = this.state.colType?true:this.state.isNorm?true:false;
			return(
				<div>
	      			<Col span={3}>
	                    <FormItem >
	                        {getFieldDecorator('database',{rules:[{required: true, message: '请选择数据库'}]})(
	                            <Select style={{width:"90%"}} placeholder="请选择数据库" onChange={this.databaseChange.bind(this)}>
									{this.state.database}
	        				    </Select>
	                        )}
	                    </FormItem>
	                </Col>
	      			<Col span={3}>
	                    <FormItem >
	                        {getFieldDecorator('table',{rules:[{required: true, message: '请选择表'}]})(
	                            <Select style={{width:"90%"}} placeholder="请选择表" onChange={this.tableChange.bind(this)}>
									{this.state.tables}
	        				    </Select>
	                        )}
	                    </FormItem>
	                </Col>	      			
	                <Col span={3}>
	                    <FormItem >
	                        {getFieldDecorator('prop',{rules:[{required: true, message: '请选择属性'}]})(
	                            <Select style={{width:"90%"}} placeholder="请选择属性" onChange={this.tableChange2.bind(this)}>
									{this.state.propObj}
	        				    </Select>
	                        )}
	                    </FormItem>
	                </Col>
	                <Col span={3}>
	                    <FormItem >
	                        {getFieldDecorator('way2',{rules:[{required: flag, message: '请选择分段类型'}]})(
	                            <Select style={{width:"90%"}} placeholder="请选择类型" disabled={this.state.colType?true:false} onChange={this.selectTypeOnChange.bind(this)}>
									<Option value="dist">等距</Option>
									<Option value="freq">等频</Option>
									<Option value="norm">正态分位数</Option>
	        				    </Select>
	                        )}
	                    </FormItem>
	                </Col>
	            	<Col span={3}>
	                    <FormItem>
				            {getFieldDecorator('date-picker2')(
				                <DatePicker style={{width:"90%"}} />
				            )}
				        </FormItem>
	                </Col>
                    <Col span={2}>
	                    <Button style={{height:"42px"}} onClick={this.toggleModal.bind(this)} disabled={btnDieabled}>分段设置</Button>
	                </Col>
				</div>
			)
		}
	}

	inputOnChange(e){
		let value = e.target.value.replace(/[^0-9]/g,'')
		this.setState({
			inputValue:value
		})
	}

	renderSegmen(type){
		if (type == "a") {
			return(
				<div style={{width:"30%",margin:"30px 0"}}> 
					<Input addonBefore="默认分为" addonAfter="段" value={this.state.inputValue} onChange={this.inputOnChange.bind(this)}/>
				</div>
			)
		}else if(type == "b"){
			return(
				<div style={{margin:"30px 0"}}> 
					<Runcondition ref="runcondition"/>
				</div>
			)
		}
	}

	radioChange(e){
		this.setState({
			radioValue:e.target.value
		})
	}

	onEvents(e) {
		let _this = this;
		if (this.state.radioValue == "a"){
			if (this.state.inputValue == "") {
				message.error("请输入分段数",3);
			}else{
				this.cun_info = _this.state.inputValue;
				_this.setState({
					visible:false
				})
				message.success("已设置",3)
			}
		}else if(this.state.radioValue == "b"){
	        let val_obj = this.refs.runcondition.getValue();
	        if (val_obj.error == "") {
	        	this.cun_info = val_obj.data;
				_this.setState({
					visible:false
				})
				message.success("已设置",3)
	        }else{
	        	message.error(val_obj.error);
	        }
		}
    }

	render(){		
		return(
			<div>
		        <Form style={{marginLeft:20}}>
		            <Row>
		            	{this.renderComponent(this.props.replaceType)}
		            	<Col span={5}>
	                        <FormItem>
					            <Button style={{marginLeft:"10%"}} type="primary" onClick={this.handelSubmit.bind(this)}>确定</Button>
					        </FormItem>
	                    </Col>
                    </Row>
                    <Modal title="分段设置" visible={this.state.visible} onCancel={this.handleCancel.bind(this)} width="50%" onOk={this.onEvents.bind(this)}>
					    <RadioGroup defaultValue="a" onChange={this.radioChange.bind(this)}>
					        <RadioButton value="a">等间隔分段</RadioButton>
					        <RadioButton value="b">自定义分段</RadioButton>
					    </RadioGroup>
					    {this.renderSegmen(this.state.radioValue)}
			        </Modal>
		        </Form>
	        	<div style={{height: 1,width: '98%',backgroundColor: '#ddd',margin: '0 auto',marginBottom:20}}></div>
			</div>	
		)
	}
}
const WrappedSearchText = Form.create()(Selectgroup);

export class FilterTable extends Component{

  	constructor(props){
        super(props);

        this.state={

        	pageCount:1,
        	bodyDate:[]
        };
    }


    onClickPage(){

    }
   
	render(){
		let scrollXWidth = this.props.tableTitleData.length * 200;
		return(
			<div style={{paddingBottom:30}}>
				<Table style={{margin:"0 20px"}} scroll={{ x: scrollXWidth }} pagination={{ defaultPageSize: 10 }} size="small" columns={this.props.tableTitleData} dataSource={this.props.tableBodyData} loading={this.props.tableLoading}/>
			</div>
		)
	}
}

export class NavComponent extends Component{

  	constructor(props){
        super(props);

        this.renderData_1 = "";
		this.renderData_2 = "";
        this.tableData_1 = [];
        this.tableData_2 = [];
        this.selectedTableData_1 = [];
		this.selectedTableData_2 = [];
		this.tableBodyData_1 = [];
		this.tableBodyData_2 = [];
		this.tableTitleData_1 = [];
		this.tableTitleData_2 = [];
		this.sendParams_1 = [];
		this.sendParams_2 = [];
		//以上 -- tab切换时，存储在state中的数据，切换时动态inset数据,不清空


        this.state={
			activeKey:1,
			renderData:"",
			tableData:[],
			selectedTableData:[],
			tableBodyData:[],
			tableTitleData:[],
			tableLoading:false
        };
    }

	onSelectHandle(key){
		this.setState({
			activeKey:key,
			renderData:this[`renderData_${key}`],
			tableData:this[`tableData_${key}`],
			selectedTableData:this[`selectedTableData_${key}`],
			tableBodyData:this[`tableBodyData_${key}`],
			tableTitleData:this[`tableTitleData_${key}`]
		})
		// setTimeout(()=>{
		// this.refs.searchText.setFieldsValue({groupName:"tbb_income_1"})
		// console.log(this.refs.searchText)

		// },500)
	}

	getData(data,args,list){
		let _this = this;
		this[`renderData_${this.state.activeKey}`] = data;
		let arr = [];
		_.map(data,(v,k)=>{
			arr.push(v[0])
		})
		this[`tableData_${this.state.activeKey}`] = arr;
		this[`selectedTableData_${this.state.activeKey}`] = arr;
		this.setState({
			renderData:data,
			tableData:arr,
			selectedTableData:arr
		})
		let params = {
			database:args.database,
			table:args.table,
			tag_group_name:args.tag_group_name,
			way:args.way,
			select_info:arr,
			all_col:list,
			cun_info:this.cun_info
		}
		this[`sendParams_${this.state.activeKey}`] = params;
		this.setState({
			tableLoading:true  
		})
		sendBaseAjax("/supereye/search_table_data",{data:JSON.stringify(params)},function(re){
			let [arr_body,arr_title] = _this.formatData(re);
			_this[`tableBodyData_${_this.state.activeKey}`] = arr_body;
			_this[`tableTitleData_${_this.state.activeKey}`] = arr_title;
			_this.setState({
				tableBodyData:arr_body,
				tableTitleData:arr_title
			},()=>{
				_this.setState({
					tableLoading:false
				})
			})
		})
	}

	formatData(re){
		let arr_body = [];
		let arr_title = []
		let index = 0;
		_.map(re,(item,key)=>{
			arr_title[index]={};
			arr_title[index].title = key;
			arr_title[index].dataIndex = key;
			arr_title[index].key = key;
			let num = 0;
			_.map(item,(v,k)=>{
				if (index == 0) {
					arr_body[num] = {key:k};
				};
				arr_body[num][key] = v;
				num++
			})
			index++;
		})
		return [arr_body,arr_title]
	}

	changeSelect(arg){
		let _this = this;
		this[`sendParams_${this.state.activeKey}`].select_info = arg;
		this[`selectedTableData_${this.state.activeKey}`] = arg
		this.setState({
			selectedTableData:arg
		})
		if (arg.length==0) {
			this.setState({
				tableBodyData:[],
			});
			_this[`tableBodyData_${_this.state.activeKey}`] = [];
		}else{
			this.setState({
				tableLoading:true
			})
			sendBaseAjax("/supereye/search_table_data",{data:JSON.stringify(this[`sendParams_${this.state.activeKey}`])},function(re){
				let [arr_body,arr_title] = _this.formatData(re);
				_this[`tableBodyData_${_this.state.activeKey}`] = arr_body;
				_this[`tableTitleData_${_this.state.activeKey}`] = arr_title;
				_this.setState({
					tableBodyData:arr_body,
					tableTitleData:arr_title
				},()=>{
					_this.setState({
						tableLoading:false
					})
				})
			})
		}

	}

	render(){
		return(
			<div>	
		        <Nav bsStyle="tabs" activeKey={this.state.activeKey} onSelect={this.onSelectHandle.bind(this)}>
		            <NavItem eventKey={1} >标签统计</NavItem>
		            <NavItem eventKey={2} title="Item">属性统计</NavItem>
		        </Nav>
		        <WrappedSearchText replaceType={this.state.activeKey} ref="searchText" getData={this.getData.bind(this)}/>
		        {this.state.renderData?<RenderEcharts type="pie" data={this.state.renderData} 
		        							checkboxData={this.state.tableData} 
		        							selectedTableData={this.state.selectedTableData}
		        							changeSelect={this.changeSelect.bind(this)} />:""}
		        {this.state.renderData?<FilterTable 
		        							tableBodyData={this.state.tableBodyData}
		        							tableTitleData={this.state.tableTitleData}
		        							tableLoading={this.state.tableLoading}
		        							/>:""}
			</div>
		)
	}
}

function initComponent(){
	ReactDOM.render(
		<NavComponent />,
		document.getElementById("render-container")
	)
}

$(document).ready(function(){
	initComponent();
})


import React from 'react';
import ReactDOM from 'react-dom';
import AddAndAlert from './component/AddAndAlert';
import Tabel from './component/Tabel';
import _ from 'underscore';
import { Select , Form , Input , Button , Cascader , Col , Row , notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

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

const group_id = GetQueryString("tag_group_id");

export class RenderDelimit extends React.Component{

	constructor(props){
		super(props);

		this.andDivTotal = 1;
		this.selectedData = [];
		this.json_data = $.parseJSON($("#json_data").attr("data-dashboard"));

		this.state={
			selectedData:[],
			renderData:{and_1:{or_1:{value:{a:{str:""}}}}},
		};
	}

	AddAndAlert(){
		this.andDivTotal = ++ this.andDivTotal;
		var index = "and_" + this.andDivTotal;
		var pushValue = this.state.renderData;
		pushValue[index] = {or_1:{value:{a:{str:""}}}}
		this.setState({
			renderData:pushValue
		});
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
		// console.log(this.refs.addAndAlert.state.renderData);
	}

	render(){
		let selectData = [];
		_.map(this.json_data,(item,key)=>{
			selectData.push(<Option key={key} ref={key} disabled={this.state.selectedData.indexOf(item.comment)!=-1?true:false} value={item.comment} data-type={item.is_enum_value} data-val={item.column_name}>{item.comment}</Option>)
		})
		return (
			<div>
				<AddAndAlert ref="addAndAlert" deleteArr={this.deleteArr.bind(this)} selectCb={this.onSelectCb.bind(this)} renderData={this.state.renderData} selectData={selectData}/>
				<span className="user_l_bq_click" onClick={this.AddAndAlert.bind(this)}><a href="javascript:void(0)"><i className="fa fa-plus"></i> 并且</a></span>
			</div>
		)
	}
}

export class TagTabel extends React.Component{

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

	editFn(arg){
		console.log(arg);
	}

	onClickPage(onPageNum){
		console.log(onPageNum)
	}

	render(){
		let bodyDateObj = ["id","tag_name","show_user_name","defind_info","status","exec_hz","last_modify_time","modify_user","celery_status"]
		return(
			<Tabel ref="tabel_one" headerData={this.headerData} noId={true} bodyDate={this.state.bodyDate} bodyDateObj={bodyDateObj} operating={["edit","repeat","remove"]} editFn={this.editFn.bind(this)} pageCount={this.state.pageCount} onClickPage={this.onClickPage.bind(this)}/>
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
		<RenderDelimit />,
		document.getElementById("render-container")
	)
}

$(document).ready(function(){
	initComponentA();
	initComponentC();
})
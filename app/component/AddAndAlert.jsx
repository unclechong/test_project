import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import { Select , Input } from 'antd';
const Option = Select.Option;


export class AddOrAlert extends React.Component{

  	constructor(props){
        super(props);

        this.state={
			orData:this.props.orData
        };
    }

	removeThisAlert(andKey,key){
		if(this.props.onRemove){
			this.props.onRemove(andKey,key)
		}
	}

	onSelect(and,or,name,r,op){
		let prop = this.state.orData.value.a.str?this.state.orData.value.a.str:"";
		let flag = op.props['data-type'];
		let val = op.props['data-val'];
		let data = this.state.orData;
		if(r!=data.value[name].str){
			data.value = {a:{str:""}}
		}
		data.value[name].str = r;
		data.value[name].val = val;
		data.value[name].flag = flag;
		this.setState({
			orData:data
		},()=>{
			if(this.props.onSelectCb){
				this.props.onSelectCb(prop,r);
			}
		})
	}

	typeOnSelect(name,val){
		let data = this.state.orData;
		data.value[name] = val;
		var keyArr = Object.keys(data.value);
		if (keyArr.indexOf(name)+1 < keyArr.length) {
			data.value[keyArr[keyArr.indexOf(name)+1]] = "";
		}
		this.setState({
			orData:data
		})
	}

	childOnchange(name,c_name,e){
		let data = this.state.orData;
		if (data.value[name] == undefined) {
			data.value[name] = {};
		}
		data.value[name][c_name] = e.target.value;
		this.setState({
			orData:data
		})
	}

	childOnselect(name,c_name,val){
		let data = this.state.orData;
		if (data.value[name] == undefined) {
			data.value[name] = {};
		}
		data.value[name][c_name] = val;
		this.setState({
			orData:data
		})
	}

	returnConditionDivPropChild(){
		let o = this.state.orData.value.c;
		if(o == 'interval'){
			return(
				<span>
					<Input onChange={this.childOnchange.bind(this,"d","a")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.a:undefined} style={{ width: 100}}/> ~ <Input onChange={this.childOnchange.bind(this,"d","b")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.b:undefined} style={{ width: 100}}/>
				</span>
			)
		}else if (o == 'include') {
			return <Input style={{ width: 100}} onChange={this.childOnchange.bind(this,"d","a")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.a:undefined} />
		}else if (o == 'equal') {
			return <Select mode="multiple" onChange={this.childOnselect.bind(this,"d","a")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.a:undefined} style={{ width: 100}}>
					   <Option value="a">1</Option>
				   	   <Option value="b">2</Option>
				   </Select>
		}else if (o == 'vChange') {
			return(
				<span>从
					<Select mode="multiple" style={{ width: 100,marginLeft:10,marginRight:10}} onChange={this.childOnselect.bind(this,"d","a")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.a:undefined} >
						<Option value="a">1</Option>
						<Option value="b">2</Option>
					</Select>变为
					<Select mode="multiple" style={{ width: 100,marginLeft:10,marginRight:40}} onChange={this.childOnselect.bind(this,"d","b")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.b:undefined} >
						<Option value="a">1</Option>
						<Option value="b">2</Option>
					</Select>时间范围：
					<Select style={{ width: 100,marginLeft:10 }} onChange={this.childOnselect.bind(this,"d","c")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.c:undefined} >
						<Option value="a">1</Option>
						<Option value="b">2</Option>
					</Select>
				</span>
			)
		}else {
			return(
				<span>在
					<Input style={{ width: 100,marginLeft:10,marginRight:10}} onChange={this.childOnchange.bind(this,"d","a")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.a:undefined}/>~
					<Input style={{ width: 100,marginLeft:10,marginRight:40}} onChange={this.childOnchange.bind(this,"d","b")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.b:undefined}/>时间范围：
					<Select style={{ width: 100,marginLeft:10 }} onChange={this.childOnselect.bind(this,"d","c")} value={this.state.orData.value.d!=undefined?this.state.orData.value.d.c:undefined}>
						<Option value="a">1</Option>
						<Option value="b">2</Option>
					</Select>
				</span>
			)
		}
	}

	returnConditionDivProp(){
		let options;
		let o = this.state.orData.value.b;
		if(o == 'prop'){
			options = this.state.orData.value.a.flag==0?[{label:"区间",value:"interval"},{label:"包含",value:"include"}]:[{label:"等于",value:"equal"}];
		}else if (o == 'vary') {
			options = [{label:"变化率",value:"cRate"},{label:"变化值",value:"cVlaue"},{label:"波动幅度",value:"range"},{label:"值变化",value:"vChange"}];
		}else if (o == 'count') {
			options = [{label:"总和",value:"sum"},{label:"平均值",value:"mean"}];
		}
		let provinceOptions = options.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
		return(
			<span>
				<Select style={{ width: 100,marginLeft:10 ,marginRight:10}} value={this.state.orData.value.c!=""?this.state.orData.value.c:undefined} placeholder="请选择" onChange={this.typeOnSelect.bind(this,"c")}>
					{provinceOptions}
				</Select>
				{this.state.orData.value.c!=undefined?this.state.orData.value.c!=""?this.returnConditionDivPropChild():"":""}
			</span>
		)
	}

	returnConditionDiv(){
		const options_1 = [{label:"属性",value:"prop"},{label:"变化",value:"vary"},{label:"统计",value:"count"}];
		const provinceOptions_1 = options_1.map(option => <Option key={option.value} value={option.value}>{option.label}</Option>);
		return(
			<span>
				<Select style={{ width: 100,marginLeft:10 }} value={this.state.orData.value.b!=""?this.state.orData.value.b:undefined} placeholder="请选择" onChange={this.typeOnSelect.bind(this,"b")}>
					{provinceOptions_1}
				</Select>
				{this.state.orData.value.b!=undefined?this.returnConditionDivProp():""}
			</span>
		)
	}

	render(){
		return(
			<div>
				<div className="user_dy_1 alert" >
					<div className="userdy_right">
						{this.props.isShow?<a href="javascript:void(0)" className="user_add user_add_po">或者</a>:""}
						<Select showSearch style={{ width: 180 }} value={this.state.orData.value.a.str!=""?this.state.orData.value.a.str:undefined} onSelect={this.onSelect.bind(this,this.props.andKey,this.props.orKey,"a")} optionFilterProp="children" placeholder="请选择" filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
							{this.props.selectData}
						</Select>
						{this.state.orData.value.a.str!=""?this.returnConditionDiv():""}
						<button onClick={this.removeThisAlert.bind(this,this.props.andKey,this.props.orKey)} type="button" className="close">
							{this.props.noX&&this.props.orKey=="or_1"?"":<span>×</span>}
						</button>
						<div className="clearfix"></div>
					</div>
				</div>
			</div>
		)
	}
}


export default class AddAndAlert extends React.Component{

	constructor(props){
		super(props);

		this.state={
			renderData:this.props.renderData
		};
	}

	AddOrAlert(and){
		let pushValue = this.state.renderData;
		let index = Object.keys(pushValue[and]).length;
		let or = "or_" + (index+1);
		pushValue[and][or] = {value:{a:{str:""}}};
		this.setState({
			renderData:pushValue
		});
	}

	onSelectCb(o,k){
		if(this.props.selectCb){
			this.props.selectCb(o,k)
		}
	}

	onRemove(and,or){
		let renderData = this.state.renderData;
		let index = Object.keys(renderData[and]).length;
        let str = renderData[and][or].value.a.str;
		if(index == 1){
			delete renderData[and];
		}else{
			delete renderData[and][or];
		}
        this.props.deleteArr(str);
		this.setState({
			renderData: renderData
		});
	}

	render(){
		return (
			<div>
				{
					_.map(this.state.renderData,(item,key)=>{
						return(
							<div className="col-sm-10" key={key}>
								{
									_.map(item,(v,k)=>{
										return <AddOrAlert ref={k} key={k} isShow={Object.keys(item)[0] != k?true:false} orData={v} noX={key=='and_1'?true:false} andKey={key} orKey={k}selectData={this.props.selectData} onRemove={this.onRemove.bind(this)} onSelectCb={this.onSelectCb.bind(this)}/>
									})
								}
								<a href="javascript:void(0)" className="user_add" onClick={this.AddOrAlert.bind(this,key)}><i className="fa fa-plus"></i> 或者条件</a>
								{key!="and_1"?<span className="user_l_bq"><a href="javascript:void(0)" > 并且</a></span>:""}
				            </div>
						)
					})
				}

			</div>
		)
	}
}

import React from 'react';
import ReactDOM from 'react-dom';

export default class Tabel extends React.Component{

  	constructor(props){
        super(props);

        this.operatingList = {
            "edit":"编辑",
            "play":"执行",
            "repeat":"刷新",
            "remove":"删除"
        }
        this.state={
            isActive:1,
            pageCount:this.props.pageCount
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            pageCount:nextProps.pageCount
        })
    }

    paginationOnclick(index){
        let num = this.state.isActive;
        //切换页脚样式
        this.changeActive(index,num)
    }

    changeActive(index,num){
        if(index == "-"){
            if (num != 1) {
                this.setState({
                    isActive:num-1
                },()=>{
                    if(this.props.onClickPage){
                        this.props.onClickPage(this.state.isActive);
                    }
                })
            }
        }else if(index == "+"){
            if (num != this.state.pageCount) {
                this.setState({
                    isActive:num+1
                },()=>{
                    if(this.props.onClickPage){
                        this.props.onClickPage(this.state.isActive);
                    }
                })
            }
        }else{
            if (index != this.state.isActive) {
                this.setState({
                    isActive:index
                },()=>{
                    if(this.props.onClickPage){
                        this.props.onClickPage(this.state.isActive);
                    }
                })
            }
        }
        setTimeout(()=>{

        },100)

    }

    opeOnclick(e,index){
        if(e == "play"){

        }else if(e == "edit"){
            if(this.props.editFn){
                this.props.editFn(index);
            }
        }else{

        }
    }

    getCurrentPage(){
        return this.state.isActive
    }

    renderHeader(){
        let tr_arr = [];
        this.props.headerData.map((val,key)=>(
            tr_arr.push(<th className="text-center" key={val.key}>{val.name}</th>)
        ))
        return (
            <tr>{tr_arr}</tr>
        )
    }

    renderBody(){
        let tr_arr = [];
        this.props.bodyDate.map((val,key)=>{
            let td_arr = [];
            this.props.bodyDateObj.map((_val,_key)=>{
                var str;
                if (typeof val[_val] == 'object') {
                    str = JSON.stringify(val[_val]);
                }else {
                    str = val[_val];
                }
                td_arr.push(<td className="text-center" key={_key}>{this.props.noId&&_key==0?key+1:str}</td>)
                if(this.props.Op&&(_key == this.props.bodyDateObj.length-1)){
                    td_arr.push(this.renderBlock(_key+1,key+1));
                }
            })
            tr_arr.push(<tr key={key}>{td_arr}</tr>);
        })
        return <tbody>{tr_arr}</tbody>
    }

    renderBlock(arg,index){
        let btn_arr = [];
        this.props.operating.map((val,key)=>{
            let c_name = "fa "+ "fa-" + val;
            btn_arr.push(<a href="javascript:void(0)" className="btn btn-sm btn-blue" key={key} onClick={this.opeOnclick.bind(this,val,index)}> <i className={c_name}></i> {this.operatingList[val]}</a>)
        })
        return(
            <td className="text-center" key={arg}>
                <center>
                    <div className="btn-group btn-group-xs">
                        {btn_arr}
                    </div>
                </center>
            </td>
        )
    }

    renderPagination(){
        let page_arr = [];
        for(let i=0;i<this.state.pageCount;i++){
            page_arr.push(<li className={this.state.isActive == i+1?"active disabled":"" } key={i}><a href="javascript:void(0)" onClick={this.paginationOnclick.bind(this,i+1)}>{i+1}</a></li>)
        }
        return(
            <div className="pull-right">
                <ul className="pagination pagination-sm pagination-user" style={{display:"inherit"}}>
                    <li className={this.state.isActive == 1?"disabled":""}><a href="javascript:void(0)" onClick={this.paginationOnclick.bind(this,1)}>&laquo;</a></li>
                    <li className={this.state.isActive == 1?"disabled":""}><a href="javascript:void(0)" onClick={this.paginationOnclick.bind(this,"-")}>&lt;</a></li>
                    {page_arr}
                    <li className={this.state.isActive == this.state.pageCount?"disabled":""}><a href="javascript:void(0)" onClick={this.paginationOnclick.bind(this,"+")}>&gt;</a></li>
                    <li className={this.state.isActive == this.state.pageCount?"disabled":""}><a href="javascript:void(0)" onClick={this.paginationOnclick.bind(this,this.state.pageCount)}>&raquo;</a></li>
                </ul>
            </div>
        )
    }

	render(){
		return(
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead>
                        {this.renderHeader()}
                    </thead>
                    {this.renderBody()}
                </table>
                {this.renderPagination()}
            </div>
		)
	}
}

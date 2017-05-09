import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import { Select , Input , Form , Button , Icon , Col , Row , Radio} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let uuid = 0;
export default class AddAndAlert extends React.Component{

  	constructor(props){
        super(props);

        this.state={
        };
    }

    remove(k){
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }

        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }

      add(){
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
      }

      handleSubmit() {
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
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
        };
        const formItemLayoutWithOutLabel = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 8, offset: 4 },
          },
        };
        const formItemLayoutF = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 12 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
          },
        };
        const formItemLayoutWithOutLabelF = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 12, offset: 12 },
          },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        console.log(keys);
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
                            whitespace: true,
                            message: "Please input passenger's name or delete this field.",
                          }],
                        })(
                          <Input placeholder="passenger name" style={{ width: '80%', marginRight: 8 }} />
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
                          }],
                        })(
                          <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
                        )}
                        <Icon
                          className="dynamic-delete-button"
                          type="minus-circle-o"
                          disabled={keys.length === 1}
                          onClick={() => this.remove(k)}
                        />
                      </FormItem>
                  </Col>
              </Row>
          );
        });
        return (
          <span>
              <FormItem {...formItemLayout} label="columnName" required={false}>
                  {getFieldDecorator('columnName',{rules:[{required: true, message: '请输入描述'}]})(
                      <Input style={{ width: '60%', marginRight: 8 }}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="columnTitle" required={false}>
                  {getFieldDecorator('columnTitle',{rules:[{required: true, message: '请输入描述'}]})(
                      <Input style={{ width: '60%', marginRight: 8 }}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="type" required={false}>
                  {getFieldDecorator('type',{rules:[{required: true, message: '请输入描述'}]})(
                      <Input style={{ width: '60%', marginRight: 8 }}/>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="args" required={false}>
                  {getFieldDecorator('args',{rules:[{required: true, message: '请输入描述'}]})(
                      <RadioGroup>
                        <RadioButton value="1">null</RadioButton>
                        <RadioButton value="0">not null</RadioButton>
                      </RadioGroup>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="focus" required={false}>
                  {getFieldDecorator('focus',{rules:[{required: true, message: '请输入描述'}]})(
                      <RadioGroup>
                        <RadioButton value="1">true</RadioButton>
                        <RadioButton value="0">false</RadioButton>
                      </RadioGroup>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="json" required={false}>
                  {getFieldDecorator('json',{rules:[{required: true, message: '请输入描述'}]})(
                      <RadioGroup>
                        <RadioButton value="1">true</RadioButton>
                        <RadioButton value="0">false</RadioButton>
                      </RadioGroup>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="key" required={false}>
                  {getFieldDecorator('key',{rules:[{required: true, message: '请输入描述'}]})(
                      <RadioGroup>
                        <RadioButton value="1">true</RadioButton>
                        <RadioButton value="0">false</RadioButton>
                      </RadioGroup>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="show" required={false}>
                  {getFieldDecorator('show',{rules:[{required: true, message: '请输入描述'}]})(
                        <RadioGroup>
                          <RadioButton value="1">true</RadioButton>
                          <RadioButton value="0">false</RadioButton>
                        </RadioGroup>
                  )}
              </FormItem>
            {formItems}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '60%' }}>
                <Icon type="plus" /> Add mapping
              </Button>
            </FormItem>
          </span>
        );
      }
}

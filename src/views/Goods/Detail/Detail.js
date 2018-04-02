import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Row, Radio, Cascader, Select, Input, message, InputNumber, Switch, Icon } from 'antd';
import draftToHtml from 'draftjs-to-html';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { d3Col0, d3Col1 } from 'components/Const';
import { MonitorInput, MonitorTextArea, rules } from 'components/input';
import Editor from 'components/Editor';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import InputSelectGroup from './InputSelectGroup';
import SkuCard from './SkuCard';
import ImageCard from './ImageCard';
import fieldLabels from './fieldLabels';
import styles from './Detail.less';

@connect(({ goods, goodsCategory, goodsBrand, marketingCategory, business, loading }) => ({
  goods,
  goodsCategory,
  goodsBrand,
  marketingCategory,
  business,
  submitting: loading.effects['goods/add'],
  fetchingBusinessList: loading.effects['business/list'],
}))
@Form.create()
export default class Detail extends Component {
  state = {
    pattern: 'detail',
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.setState({
      pattern: Number(id) === 0 ? 'add' : 'detail',
    });
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (Number(id) !== 0) {
      dispatch({
        type: 'goods/detail',
        payload: { id },
      });
    }

    dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });

    dispatch({
      type: 'marketingCategory/list',
      payload: {},
    });

    dispatch({
      type: 'goods/unit',
      payload: {},
    });
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;

    import('draft-js').then((raw) => {
      const { convertToRaw } = raw;

      const description = draftToHtml(
        convertToRaw(this.editor.state.editorState.getCurrentContent())
      );

      validateFieldsAndScroll((error, values) => {
        // 对参数进行处理
        if (!error) {
          dispatch({
            type: 'goods/add',
            payload: {
              description,
              ...values,
            },
          }).then(() => {
            const { result, msg } = this.props.goods;
            if (result === 1) {
              message.error(`提交失败！${msg}`);
            } else if (result === 0) {
              message.success('提交成功。', 1, () => {
                history.back();
              });
            }
          });
        }
      });
    });
  }

  handleCategoryChange = (value) => {
    const { dispatch } = this.props;

    if (value.length) {
      dispatch({
        type: 'goodsBrand/list',
        payload: {},
      });
    }
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  render() {
    const { form, submitting, goods, goodsCategory, marketingCategory, goodsBrand } = this.props;
    const { pattern } = this.state;

    const disabled = pattern === 'detail';
    const options = [
      { label: '阳台', value: 0 },
      { label: '客厅', value: 1 },
      { label: '厨房', value: 2 },
      { label: '阳台', value: 3 },
      { label: '客厅', value: 4 },
      { label: '厨房', value: 5 },
      { label: '阳台', value: 6 },
      { label: '客厅', value: 7 },
      { label: '厨房', value: 8 },
    ];

    return (
      <PageHeaderLayout>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="所属商家">
                  {form.getFieldDecorator('business', {
                    rules: [{
                      required: true, message: '请填写所属商家',
                    }, {
                      validator: (rule, value, callback) => {
                        const { dispatch } = this.props;
                        dispatch({
                          type: 'business/exsit',
                          payload: { name: value },
                        }).then(() => {
                          const { exsit = {} } = this.props.business;
                          if (exsit.result === 1) {
                            callback();
                          } else if (exsit.result === 0) {
                            callback(exsit.msg || '不存在此商家！');
                          }
                        });
                      },
                    }],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品名称">
                  {form.getFieldDecorator('name', {
                    rules: rules([{
                      required: true, message: '请输入商品名称',
                    }, {
                      max: 60,
                    }]),
                  })(
                    <MonitorInput maxLength={60} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品分类">
                  {form.getFieldDecorator('category', {
                    rules: [{
                      required: true, message: '请输入商品分类',
                    }],
                  })(
                    <Cascader
                      options={goodsCategory?.list?.list}
                      placeholder=""
                      onChange={this.handleCategoryChange}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="商品品牌">
                  {form.getFieldDecorator('brand', {
                    rules: [{
                      required: true, message: '请填写商品品牌',
                    }],
                  })(
                    <Select
                      placeholder={!goodsBrand?.list?.list?.length ? '请先选择商品分类' : ''}
                      disabled={!goodsBrand?.list?.list?.length || disabled}
                    >
                      {goodsBrand?.list?.list.map(brand => (
                        <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品类型">
                  {form.getFieldDecorator('type', {
                    rules: [{ required: true, message: '请填写商品品牌' }],
                  })(
                    <Select disabled={disabled}>
                      <Select.Option value={0}>标准商品</Select.Option>
                      <Select.Option value={1}>定制商品</Select.Option>
                      <Select.Option value={2}>赠品</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品标签">
                  {form.getFieldDecorator('tag', {
                    rules: rules([{
                      max: 50,
                    }]),
                  })(
                    <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="商品卖点">
                  {form.getFieldDecorator('sellingPoint', {
                    rules: rules([{
                      max: 50,
                    }]),
                  })(
                    <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="营销分类">
                  {form.getFieldDecorator('marketingType', {
                    rules: [],
                  })(
                    <Cascader
                      options={marketingCategory?.list?.list}
                      placeholder=""
                      onChange={this.handleCategoryChange}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="售后服务时间">
                  {form.getFieldDecorator('afterSaleServiceTime', {
                    rules: [],
                    initialValue: {
                      number: 3,
                      unit: 'month',
                    },
                  })(
                    <InputSelectGroup disabled={disabled}>
                      <Select.Option value="year">年</Select.Option>
                      <Select.Option value="month">月</Select.Option>
                      <Select.Option value="day">日</Select.Option>
                    </InputSelectGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="SEO" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="SEO标题">
                  {form.getFieldDecorator('seoTitle', {
                    rules: rules([{
                      max: 200,
                    }]),
                  })(
                    <MonitorTextArea datakey="seoTitle" rows={5} maxLength={200} form={form} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="SEO描述">
                  {form.getFieldDecorator('seoDescription', {
                    rules: rules([{
                      max: 200,
                    }]),
                  })(
                    <MonitorTextArea datakey="seoDescription" rows={5} maxLength={200} form={form} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="SEO关键字">
                  {form.getFieldDecorator('seoKeywords', {
                    rules: rules([{
                      max: 200,
                    }]),
                  })(
                    <MonitorTextArea datakey="seoKeywords" rows={5} maxLength={200} form={form} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="基本属性" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="适用位置">
                  {form.getFieldDecorator('position', {
                    rules: [{
                      required: true, message: '请选择适用位置',
                    }],
                  })(
                    <Radio.Group options={options} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="可送货/安装">
                  {form.getFieldDecorator('delivery', {
                    valuePropName: 'checked',
                    rules: [{
                      required: true, message: '请选择是否可送货/安装',
                    }],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="是否带储物空间">
                  {form.getFieldDecorator('storage', {
                    rules: [],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="是否可订制">
                  {form.getFieldDecorator('custom', {
                    rules: [],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="单位">
                  {form.getFieldDecorator('saleUnit', {
                    rules: [],
                  })(
                    <Select disabled={disabled}>
                      {goods?.unit?.map(v =>
                        <Select.Option key={v.id} value={v.id}>{v.text}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="产地">
                  {form.getFieldDecorator('productionPlace', {
                    rules: [],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="材质">
                  {form.getFieldDecorator('material', {
                    rules: [],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="面料">
                  {form.getFieldDecorator('fabric', {
                    rules: [],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="运费属性" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="长">
                  {form.getFieldDecorator('long', {
                    rules: [],
                    initialValue: {
                      unit: 'cm',
                    },
                  })(
                    <InputSelectGroup disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="宽">
                  {form.getFieldDecorator('width', {
                    rules: [],
                    initialValue: {
                      unit: 'cm',
                    },
                  })(
                    <InputSelectGroup disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1} >
                <Form.Item label="高">
                  {form.getFieldDecorator('height', {
                    rules: [],
                    initialValue: {
                      unit: 'cm',
                    },
                  })(
                    <InputSelectGroup disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="体积">
                  {form.getFieldDecorator('cubage', {
                    rules: [],
                    initialValue: {
                      unit: 'm3',
                    },
                  })(
                    <InputSelectGroup disabled={disabled}>
                      <Select.Option value="m3">m<sup>3</sup></Select.Option>
                      <Select.Option value="ml">ml</Select.Option>
                    </InputSelectGroup>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="重量">
                  {form.getFieldDecorator('weight', {
                    rules: [],
                    initialValue: {
                      unit: 'kg',
                    },
                  })(
                    <InputSelectGroup disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1} >
                <Form.Item label="是否支持全国配送">
                  {form.getFieldDecorator('nationalDistribution', {
                    rules: [],
                  })(
                    <Switch disabled={disabled} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="价格属性" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="物料编码">
                  {form.getFieldDecorator('code', {
                    rules: [{
                      max: 50,
                    }],
                  })(
                    <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="条形码">
                  {form.getFieldDecorator('barCode', {
                    rules: [{
                      max: 50,
                    }],
                  })(
                    <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1} >
                <Form.Item label="起订量">
                  {form.getFieldDecorator('moq', {
                    rules: [],
                    initialValue: 0,
                  })(
                    <InputNumber
                      min={0}
                      precision={0}
                      step={1}
                      disabled={disabled}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="供货价">
                  {form.getFieldDecorator('supplyPrice', {
                    rules: [],
                    initialValue: 0,
                  })(
                    <InputNumber
                      min={0}
                      precision={2}
                      step={0.01}
                      disabled={disabled}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1} >
                <Form.Item label="折扣价">
                  {form.getFieldDecorator('discountPrice', {
                    rules: [{
                      validator: (rule, value, callback) => {
                        if (form.getFieldValue('supplyPrice') <= value) {
                          callback();
                        } else {
                          callback('必须大于或等于供货价');
                        }
                      },
                    }],
                    initialValue: 0,
                  })(
                    <InputNumber
                      min={0}
                      precision={2}
                      step={0.01}
                      disabled={disabled}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1} >
                <Form.Item label="售价">
                  {form.getFieldDecorator('price', {
                    rules: [{
                      validator: (rule, value, callback) => {
                        if (form.getFieldValue('discountPrice') <= value) {
                          callback();
                        } else {
                          callback('必须大于或等于折扣价');
                        }
                      },
                    }],
                    initialValue: 0,
                  })(
                    <InputNumber
                      min={0}
                      precision={2}
                      step={0.01}
                      disabled={disabled}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="市场价">
                  {form.getFieldDecorator('maketPrice', {
                    rules: [{
                      validator: (rule, value, callback) => {
                        if (form.getFieldValue('price') <= value) {
                          callback();
                        } else {
                          callback('必须大于或等于售价');
                        }
                      },
                    }],
                    initialValue: 0,
                  })(
                    <InputNumber
                      min={0}
                      precision={2}
                      step={0.01}
                      disabled={disabled}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <SkuCard form={form} disabled={disabled} />

        {
          form.getFieldDecorator('imgCard', {
          })(
            <ImageCard disabled={disabled} />
          )
        }

        <Card title="介绍" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Editor ref={(inst) => { this.editor = inst; }} maxLength={2} disabled={disabled} />
            </Row>
          </Form>
        </Card>

        <DetailFooterToolbar
          form={form}
          fieldLabels={fieldLabels}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}

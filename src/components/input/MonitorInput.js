import React, { Component } from 'react';
import { Input } from 'antd';
import './MonitorInput.scss';

export default class MonitorInput extends Component {
  state = {
    currNum: 0,
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({
      currNum: value.length,
    });

    this.props.onChange(value);
  }

  render() {
    const { maxLength } = this.props;
    const { currNum } = this.state;

    return (
      !Number(maxLength)
        ? <Input {...this.props} />
        : (
          <div>
            <Input
              {...this.props}
              style={{
                paddingRight: (`${maxLength}`.length + 3) * 8,
              }}
              onChange={this.handleChange.bind(this)}
            />
            <div styleName="monitor">
              <span>{currNum}</span>/{maxLength}
            </div>
          </div>
        )
    );
  }
}

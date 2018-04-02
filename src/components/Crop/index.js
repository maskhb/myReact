// import React, { Component, PropTypes } from 'react';
// import { Modal, Button, Upload } from 'antd';
// import 'cropperjs/dist/cropper.css';
// import '../Upload/image/style.css';
//
// import { requestRoot, tokenKey } from 'configs/global';
// import cookie from 'cookies-js';
// import Cropper from './react-cropper';
//
// import ImgUpload from '../img-uploader';
//
// /* global FileReader */
// const PREFIX = 'c-img-uploader';
//
// export default class Crop extends Component {
//   constructor(props) {
//     super(props);
//     var value = props.defaultValue || props.value;
//     if (value) {
//       if (!(value instanceof Array)) {
//         value = [value];
//       }
//     }
//
//     this.state = {
//       src: null,
//       cropResult: null,
//       vi: false,
//       fileList: value || [],
//       uploading: false
//     };
//
//     this.cropImage = this.cropImage.bind(this);
//     this.onChange = this.onChange.bind(this);
//     this.cancel = this.cancel.bind(this);
//   }
//
//   onChange(e) {
//     e.preventDefault();
//     let files;
//     if (e.dataTransfer) {
//       files = e.dataTransfer.files;
//     } else if (e.target) {
//       files = e.target.files;
//     }
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.setState({
//         src: reader.result
//       });
//     };
//     reader.readAsDataURL(files[0]);
//   }
//
// dataURLtoBlob(dataurl) {
//     let arr = dataurl.split(','),
//         mime = arr[0].match(/:(.*?);/)[1],
//         bstr = atob(arr[1]),
//         n = bstr.length,
//         u8arr = new Uint8Array(n);
//         while(n--){
//             u8arr[n] = bstr.charCodeAt(n);
//         }
//     return new Blob([u8arr], {type:mime});
//   }
//   cropImage(cb) {
//     if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
//       return;
//     }
//
//     let dataUrl = this.cropper.getCroppedCanvas().toDataURL('image/jpeg')
//     let bd = this.dataURLtoBlob(dataUrl)
//     // this.cropper.getCroppedCanvas().toBlob(blob => {
//     //   console.log(blob)
//       this.setState({ cropResult: bd });
//       cb(bd);
//     // });
//   }
//
//   getFileListByValue(value) {
//     return _.map(value, (url, index) => {
//       return {
//         uid: index + url,
//         name: url,
//         status: 'done',
//         url: url,
//         thumbUrl: url
//       };
//     });
//   }
//
//   componentWillReceiveProps(nextProps) {
//     let { fileList } = this.state;
//
//     if (typeof nextProps['value'] !== 'undefined') {
//       let value =
//         nextProps['value'] instanceof Array
//           ? nextProps['value']
//           : nextProps['value'] ? [nextProps['value']] : [];
//       this.setState({
//         fileList: value
//       });
//     } else if (
//       fileList &&
//       fileList.length > 0 &&
//       fileList.every(v => {
//         return v.status === 'done' || v.status === 'uploading';
//       })
//     ) {
//       this.setState({
//         fileList: []
//       });
//     }
//   }
//
//
//   getHttpProps() {
//     if (!this.httpProps) {
//       this.httpProps = {
//         action: requestRoot + '/api/upload/img',
//         data: {
//           token: cookie.get('x-manager-token'),
//           loginType: 1,
//           type: 2,
//           watermark: this.props.watermark ? 1 : 0
//         },
//         headers: {
//           'x-client-channel': 0,
//           'x-client-hardware': 0,
//           'x-client-id': cookie.get('x-client-id'),
//           'x-client-os': 'web',
//           'x-client-os-version': 0,
//           'x-client-type': 'pc',
//           'x-client-version-code': 0,
//           'x-client-version-name': 0
//         }
//       };
//     }
//     return this.httpProps;
//   }
//
//   cancel() {
//     this.setState({ vi: false });
//   }
//
//   handleBeforeUpload(file, fileList) {
//     // console.log(file);
//     let files = [file];
//     this.currentUid = file.uid;
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.setState({ src: reader.result });
//     };
//     reader.readAsDataURL(files[0]);
//
//     this.setState({ vi: true });
//     return new Promise((resolv, rejcted) => {
//       this.resolv = resolv;
//     });
//   }
//
//   handleChange(e) {
//     this.cropImage(blob => {
//       const fileList = [blob];
//       var { value, onChange, uploadChange } = this.props;
// TODO，注意， 此处的this指向的是Form，非此Class，故执行的this.onChange为Form的方法
//       // console.log(fileList);
//       // if (this.resolv) {
//       //   const file = new File([blob], 'name.png', {
//       //     type: 'image/png',
//       //     lastModified: new Date()
//       //   });
//       //   file.uid = this.currentUid;
//       //   this.resolv(file);
//       //   this.setState({ vi: false });
//       //   // console.log(this.resolv(file), file)
//       //   return;
//       // }
//       const data = new FormData();
//       data.append('token', cookie.get("x-manager-token"));
//       data.append('loginType', 1);
//       data.append('type', 2);
//       data.append('watermark', (this.props.watermark)?1:0);
//       data.append('file', blob, 'test.jpeg');
//
//       console.log(data, fileList, blob)
//
//       fetch(requestRoot+"/api/upload/img", {method: "POST",
//       headers: {
//         "x-client-channel" :0,
//         "x-client-hardware" : 0,
//         "x-client-id" : cookie.get('x-client-id'),
//         "x-client-os"  : "web",
//         "x-client-os-version" : 0 ,
//         "x-client-type" : "pc",
//         "x-client-version-code" : 0,
//         "x-client-version-name" : 0
//       } ,
//       body: data}).then((res) => {
//         this.setState({ vi : false })
//         // console.log(res)
//         return res.json()
//
//       }).then(json => {
//         let value = json.data
//         this.setState({
//           fileList: [value[0].url]
//         });
//         if (this.props.onChange) {
//           this.props.onChange(value[0].url)
//         }
//
//         // console.log(this.state.fileList)
//       })
//
//     });
//   }
//
//
//   render() {
//     let { maxLength, ...props } = this.props,
//       { fileList } = this.state,
//       btnHideClass = '';
//     // console.log('-------------------------------------', props);
//     if (fileList.length >= maxLength) {
//       btnHideClass = 'btn-hide';
//     }
//     // fileList = ['https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
//     // ];
//
//     return (
//       <div className={`${PREFIX} clearfix ${btnHideClass}`}>
//         <ImgUpload
//           {...props}
//           key="pic"
//           defaultValue={fileList}
//           value={fileList}
//           maxLength={1}
//           maxSize={500}
//           beforeUpload={this.handleBeforeUpload.bind(this)}
//         />
//         <Modal
//           className='cut-img-uploader'
//           width="850px"
//           visible={this.state.vi}
//           title="选择图片"
//           onClose={this.cancel}
//           footer={[
//             <Button key="back" onClick={() => this.file.click()}>
//               重新选择
//             </Button>,
//             <Button
//               key="submit"
//               type="primary"
//               onClick={this.handleChange.bind(this)}
//             >
//               完成
//             </Button>
//           ]}
//         >
//           <div style={{ width: '100%', height: '500px', padding: '0 30px' }}>
//             <input
//               type="file"
//               style={{ margin: '0 auto', marginTop: '30px', display: 'none' }}
//               ref={file => (this.file = file)}
//               onChange={this.onChange}
//             />
//             <div className="pre-box" style={{ width: '350px', float: 'left' }}>
//               <div style={{ margin: '30px 0' }}>
//                 <h2>原图</h2>
//               </div>
//               <div
//                 className="box"
//                 style={{
//                   width: '350px',
//                   height: '300px',
//                   paddingTop: '66px',
//                   backgroundColor: '#e9ecef'
//                 }}
//               >
//                 <div
//                   className="img-preview"
//                   style={{
//                     width: '100%',
//                     float: 'right',
//                     height: '200px',
//                     overflow: 'hidden'
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="cut-box" style={{ width: '350px', float: 'right' }}>
//               <div style={{ margin: '30px 0' }}>
//                 <h2>图片&nbsp;展示区域</h2>
//               </div>
//               <Cropper
//                 style={{ height: '300px', width: '350px' }}
//                 aspectRatio={25 / 12}
//                 viewMode={2}
//                 preview=".img-preview"
//                 guides={false}
//                 src={this.state.src}
//                 ref={cropper => {
//                   this.cropper = cropper;
//                 }}
//               />
//             </div>
//           </div>
//         </Modal>
//       </div>
//     );
//   }
// }
//
// Crop.propTypes = _.extend({}, Upload.propTypes, {
//   maxLength: PropTypes.number, //可上传最大数量
//   maxSize: PropTypes.number,
//   onChange: PropTypes.func,
//   uploadChange: PropTypes.func,
//   watermark: PropTypes.bool
// });
//
// Crop.defaultProps = _.extend({}, Upload.defaultProps, {
//   maxLength: 1,
//   maxSize: 500, //kb
//   listType: 'picture-card',
//   type: 'select',
//   showUploadList: true,
//   watermark: false //是否上传水印
// });

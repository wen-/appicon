import React from 'react';
import './FileAdd.css';

function FileAdd(props) {
  const {onChange} = props;
  const inputEl = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(undefined);

  const fileChange = (e)=>{
    const file = inputEl.current.files[0];
    const reader = new FileReader();
    reader.onload = function() {
      // const img = new Image();
      const imgUrl = this.result;

      file.url = imgUrl;
      onChange(file);
      setImgSrc(imgUrl);
      // img.onload = function(){
      //   // const h = img.height;
      //   // const w = img.width;

      //   // const canv = document.createElement("canvas");
      //   // canv.id = "oldPic";
      //   // canv.setAttribute("height",h);
      //   // canv.setAttribute("width",w);

      //   // const ctx = canv.getContext('2d');
      //   // ctx.drawImage(img, 0, 0);

      //   // var f = {};
      //   // f.name = file.name;
      //   // f.data = oldData;
      //   file.width = img.width;
      //   file.height = img.height;
      //   onChange(file);
      //   setImgSrc(imgUrl);
      // }
      // img.src = imgUrl;
    }
    reader.readAsDataURL(file);
  }

  const remove = ()=>{
    setImgSrc(undefined);
    onChange(undefined);
  }

  return (
    <div className="FileAddComponent">
      {!!imgSrc?(
        <span className="imgItem">
          <img src={imgSrc} alt='' />
          <span className="removeImg" onClick={remove}>移除</span>
        </span>
      ):(
        <>
          <span className="selectPicLabel">选择图片</span>
          <input ref={inputEl} type="file" accept="image/*" id="selectPic" className="selectPic" onChange={fileChange} />
        </>
      )}
    </div>
  );
}

export default FileAdd;

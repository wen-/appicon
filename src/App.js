import React from 'react';
import './App.css';
import FileAdd from './component/FileAdd';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import iOSIconJson from './iOSIconJson';

function App() {
  const [file, setFile] = React.useState(undefined);
  const [sizeIOS, setSizeIOS] = React.useState([1024, 180, 120, 87, 80, 60, 58, 40]);
  const [sizeAndroid, setSizeAndroid] = React.useState([192, 144, 96, 72, 48]);

  React.useEffect(()=>{
    if(file && file.url){
      const img = new Image();
      img.onload = function(){
          const h = img.height;
          const w = img.width;
          if(h!=1024 || w!=1024){
            console.warn('图片尺寸不是1024x1024！');
          }

          const titleIOS = document.createElement("div");
          const titleIOSText = document.createTextNode("iOS图标：");
          titleIOS.style.marginTop = '3em';
          titleIOS.style.marginBottom = '1em';
          titleIOS.style.fontSize = '2em';
          titleIOS.appendChild(titleIOSText);
          document.getElementById('iOS').appendChild(titleIOS);

          const iOSIcon = sizeIOS.map((size)=>{
            return createCanvas(img, size, 'iOS');
          });

          const titleAndroid = document.createElement("div");
          const titleAndroidText = document.createTextNode("android图标：");
          titleAndroid.style.marginTop = '3em';
          titleAndroid.style.marginBottom = '1em';
          titleAndroid.style.fontSize = '2em';
          titleAndroid.appendChild(titleAndroidText);
          document.getElementById('iOS').appendChild(titleAndroid);

          const androidIcon = sizeAndroid.map((size)=>{
            return createCanvas(img, size, 'android');
          });

          const zip = new JSZip();
          const iOSFolder = zip.folder("iOS");
          const iOSFolder_appicon = iOSFolder.folder("AppIcon.appiconset");
          const androidFolder = zip.folder("android");
          const androidFolder_m = androidFolder.folder("mipmap-mdpi");
          const androidFolder_h = androidFolder.folder("mipmap-hdpi");
          const androidFolder_x = androidFolder.folder("mipmap-xhdpi");
          const androidFolder_xx = androidFolder.folder("mipmap-xxhdpi");
          const androidFolder_xxx = androidFolder.folder("mipmap-xxxhdpi");

          iOSFolder_appicon.file('Contents.json', JSON.stringify(iOSIconJson, null, 2));
          iOSIcon.forEach((item)=>{
            const base64data = item.ctx.canvas.toDataURL().match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            iOSFolder_appicon.file(`Icon-${item.size}.png`, base64data[2], {base64: true});
          });

          androidIcon.forEach((item)=>{
            const base64data = item.ctx.canvas.toDataURL().match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const base64dataRound = item.ctxRound.canvas.toDataURL().match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            switch(item.size){
              case 48:
                androidFolder_m.file(`icon.png`, base64data[2], {base64: true});
                androidFolder_m.file(`icon_round.png`, base64dataRound[2], {base64: true});
                androidFolder_m.file(`transparent_round.png`, base64dataRound[2], {base64: true});
                break;
              case 72:
                androidFolder_h.file(`icon.png`, base64data[2], {base64: true});
                androidFolder_h.file(`icon_round.png`, base64dataRound[2], {base64: true});
                androidFolder_h.file(`transparent_round.png`, base64dataRound[2], {base64: true});
                break;
              case 96:
                androidFolder_x.file(`icon.png`, base64data[2], {base64: true});
                androidFolder_x.file(`icon_round.png`, base64dataRound[2], {base64: true});
                androidFolder_x.file(`transparent_round.png`, base64dataRound[2], {base64: true});
                break;
              case 144:
                androidFolder_xx.file(`icon.png`, base64data[2], {base64: true});
                androidFolder_xx.file(`icon_round.png`, base64dataRound[2], {base64: true});
                androidFolder_xx.file(`transparent_round.png`, base64dataRound[2], {base64: true});
                break;
              case 192:
                androidFolder_xxx.file(`icon.png`, base64data[2], {base64: true});
                androidFolder_xxx.file(`icon_round.png`, base64dataRound[2], {base64: true});
                androidFolder_xxx.file(`transparent_round.png`, base64dataRound[2], {base64: true});
                break;
              default:
            }
          });

          zip.generateAsync({type:"blob"}).then(function(content) {
              // see FileSaver.js
              saveAs(content, "appIcon.zip");
          });

      }
      img.src = file.url;
    }
  }, [file, sizeIOS, sizeAndroid]);

  const createCanvas = (img, size, platform)=>{
    const canv = document.createElement("canvas");
    const canvRound = document.createElement("canvas");

    canv.setAttribute("height",size);
    canv.setAttribute("width",size);
    const ctx = canv.getContext('2d');

    canvRound.setAttribute("height",size);
    canvRound.setAttribute("width",size);
    const ctxRound = canvRound.getContext('2d');

    ctx.drawImage(img, 0, 0, size, size);

    const data = {ctx, size};

    if(platform === 'android'){
      ctxRound.arc(size*.5, size*.5, size*.5, 0, 2 * Math.PI);
      ctxRound.clip();
      // ctxRound.fillRect(0, 0, size,size);
      ctxRound.drawImage(img, 0, 0, size, size);
      data.ctxRound = ctxRound;
    }

    const span = document.createElement("span");
    const sizeText = document.createTextNode(`${size}x${size}`);
    span.style.display = 'inline-block';
    span.style.margin = '1em';
    canv.style.display = 'block';
    span.appendChild(canv);
    span.appendChild(sizeText);
    document.getElementById(platform).appendChild(span);
    return data;
  };

  const fileChange = (file)=>{
    console.log(file);
    setFile(file);
    if(!file){
      document.getElementById("iOS").innerHTML='';
      document.getElementById("android").innerHTML='';
    }
  };

  return (
    <div className="App">
      <FileAdd onChange={fileChange} />
      <span>*建议图片尺寸：1024x1024，可自动生成iOS及android应用图标，并自动下载（zip）,使用谷歌浏览器体验效果更佳。</span>
      <div id="iOS"></div>
      <div id="android"></div>
    </div>
  );
}

export default App;

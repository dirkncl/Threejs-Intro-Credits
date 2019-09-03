"use strict";class YouKnowMe{static semitone(t="REST"){const e=/^([A-G])(\-?\d+)(b{0,2}|#{0,2})$/;if(!e.test(t))return-1/0;const[,i,s,a]=t.match(e),r={C:0,D:2,E:4,F:5,G:7,A:9,B:11},n={"-1":0,0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11},h={bb:-2,b:-1,"":0,"#":1,"##":2};return void 0===r[i]||void 0===n[s]||void 0===h[a]?-1/0:r[i]+12*n[s]+h[a]}static note(t=-1/0){const e=Math.floor(t/12),i=Math.floor(t-12*e),s=[-1,0,1,2,3,4,5,6,7,8,9,10][e],a=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][i];return void 0===s||void 0===a?"REST":a.charAt(0)+s.toString()+a.charAt(1)}static frequency(t=-1/0){return 440*Math.pow(2,(t-69)/12)}constructor(t=2,e=44100,i=16,s=!0,a=[]){var r=i>>>3;this.header=new ArrayBuffer(44),this.view=new DataView(this.header),this.data=a,Object.defineProperty(this,"littleEndian",{configurable:!1,enumerable:!0,value:s,writable:!1}),this.pointer=0,this.ChunkID=s?"RIFF":"RIFX",this.ChunkSize=this.header.byteLength-8,this.Format="WAVE",this.SubChunk1ID="fmt ",this.SubChunk1Size=16,this.AudioFormat=1,this.NumChannels=t,this.SampleRate=e,this.ByteRate=t*e*r,this.BlockAlign=t*r,this.BitsPerSample=i,this.SubChunk2ID="data",this.SubChunk2Size=a.length*r}setString(t,e=t.length,i=0){for(var s=0;s<e;s++)this.view.setUint8(i+s,t.charCodeAt(s))}getString(t,e=0){for(var i=0,s="";i<t;i++)s+=String.fromCharCode(this.view.getUint8(e+i));return s}set ChunkID(t){this.setString(t,4,0)}get ChunkID(){return this.getString(4,0)}set ChunkSize(t){this.view.setUint32(4,t,this.littleEndian)}get ChunkSize(){return this.view.getUint32(4,this.littleEndian)}set Format(t){this.setString(t,4,8)}get Format(){return this.getString(4,8)}set SubChunk1ID(t){this.setString(t,4,12)}get SubChunk1ID(){return this.getString(4,12)}set SubChunk1Size(t){this.view.setUint32(16,t,this.littleEndian)}get SubChunk1Size(){return this.view.getUint32(16,this.littleEndian)}set AudioFormat(t){this.view.setUint16(20,t,this.littleEndian)}get AudioFormat(){return this.view.getUint16(20,this.littleEndian)}set NumChannels(t){this.view.setUint16(22,t,this.littleEndian)}get NumChannels(){return this.view.getUint16(22,this.littleEndian)}set SampleRate(t){this.view.setUint32(24,t,this.littleEndian)}get SampleRate(){return this.view.getUint32(24,this.littleEndian)}set ByteRate(t){this.view.setUint32(28,t,this.littleEndian)}get ByteRate(){return this.view.getUint32(28,this.littleEndian)}set BlockAlign(t){this.view.setUint16(32,t,this.littleEndian)}get BlockAlign(){return this.view.getUint16(32,this.littleEndian)}set BitsPerSample(t){this.view.setUint16(34,t,this.littleEndian)}get BitsPerSample(){return this.view.getUint16(34,this.littleEndian)}set SubChunk2ID(t){this.setString(t,4,36)}get SubChunk2ID(){return this.getString(4,36)}set SubChunk2Size(t){this.view.setUint32(40,t,this.littleEndian)}get SubChunk2Size(){return this.view.getUint32(40,this.littleEndian)}get typedData(){var t,e,i=this.BitsPerSample>>>3,s=this.data,a=this.SubChunk2Size,r=a/i,n=new ArrayBuffer(a),h=new Uint8Array(n),l=Math.pow(2,(i<<3)-1)-1;switch(i){case 1:for(t=0;t<r;t++)h[t]=s[t]*l+128&255;break;case 2:if(this.littleEndian)for(t=0;t<r;t++)e=s[t]*l+65536&65535,h[2*t]=255&e,h[2*t+1]=e>>>8;else for(t=0;t<r;t++)e=s[t]*l+65536&65535,h[2*t]=e>>>8,h[2*t+1]=255&e;break;case 3:if(this.littleEndian)for(t=0;t<r;t++)e=s[t]*l+16777216&16777215,h[3*t]=255&e,h[3*t+1]=e>>>8&255,h[3*t+2]=e>>>16;else for(t=0;t<r;t++)e=s[t]*l+16777216&16777215,h[3*t]=e>>>16,h[3*t+1]=e>>>8&255,h[3*t+2]=255&e;case 4:if(this.littleEndian)for(t=0;t<r;t++)e=s[t]*l+4294967296&4294967295,h[4*t]=255&e,h[4*t+1]=e>>>8&255,h[4*t+2]=e>>>16&255,h[4*t+3]=e>>>24;else for(t=0;t<r;t++)e=s[t]*l+4294967296&4294967295,h[4*t]=e>>>24,h[4*t+1]=e>>>16&255,h[4*t+2]=e>>>8&255,h[4*t+3]=255&e}return n}toBlob(){return new Blob([this.header,this.typedData],{type:"audio/wav"})}toBuffer(){return Buffer.concat([Buffer.from(this.header),Buffer.from(this.typedData)])}tell(){return this.pointer/this.NumChannels/this.SampleRate}seek(t,e=!0){var i=this.data,s=Math.round(this.SampleRate*t);if(this.pointer=this.NumChannels*s,e)for(;i.length<this.pointer;)i[i.length]=0;else this.pointer=i.length}writeNote({note:t,time:e,amplitude:i=1},s=[],a=!0,r=!1){var n=this.data,h=this.NumChannels,l=this.SampleRate;var o,u,d,f,c=YouKnowMe.semitone(t),b=YouKnowMe.frequency(c)*Math.PI*2/l,p=(Math.PI,Math.round(l*e)),v=p-.001*l,y=p-v+1,g=this.pointer,m=n.length,k=Math.min(Math.floor((m-g)/h),p);if(0===s.length)for(s=[],o=0;o<h;o++)s[o]=o;var S=[];for(o=0;o<h;o++)S[o]=-1===s.indexOf(o);for(o=0;o<k;o++)for(u=0;u<s.length;u++)d=g+o*h+s[u],f=0,b>0&&(f=i*Math.sin(b*o)*(o<y?o:o>v?p-o+1:y)/y),n[d]=f+(a?n[d]:0);for(o=k;o<p;o++)for(d=g+o*h,u=0;u<h;u++)f=0,(b>0||!S[u])&&(f=i*Math.sin(b*o)*(o<y?o:o>v?p-o+1:y)/y),n[d+u]=f;var w=Math.max(g+p*h,m)*this.BitsPerSample>>>3;this.ChunkSize=w+this.header.byteLength-8,this.SubChunk2Size=w,r||(this.pointer=g+p*h)}writeProgression(t,e=1,i=[],s=!0,a=!1,r=1){for(var n,h,l,o,u,d,f=this.pointer,c=0;c<t.length;c++)({note:n,time:h,amplitude:l,offset:o}=t[c]),void 0!==o&&this.seek(o),1===r||"REST"===n?this.writeNote({note:n,time:h,amplitude:void 0===l?e:l*e},i,s,!1):(d=h-(u=h*r),this.writeNote({note:n,time:u,amplitude:void 0===l?e:l*e},i,s,!1),this.writeNote({note:"REST",time:d},i,s,!1));a&&(this.pointer=f)}}class WhyYouHateMe{constructor(t){this.data=new Uint8Array(t),this.byteOffset=0,this.lastEventTypeByte=0}readString(t){for(var e=this.byteOffset,i=0,s="";i<t;i++)s+=String.fromCharCode(this.data[e+i]);return this.byteOffset+=t,s}readUint32(){var t=this.byteOffset,e=this.data[t]<<24|this.data[t+1]<<16|this.data[t+2]<<8|this.data[t+3];return this.byteOffset+=4,e}readUint24(){var t=this.byteOffset,e=this.data[t]<<16|this.data[t+1]<<8|this.data[t+2];return this.byteOffset+=3,e}readUint16(){var t=this.byteOffset,e=this.data[t]<<8|this.data[t+1];return this.byteOffset+=2,e}readUint8(){var t=this.byteOffset,e=this.data[t];return this.byteOffset+=1,e}readInt8(){var t=this.byteOffset,e=this.data[t];return!0&e&&(e^=4294967040),this.byteOffset+=1,e}readVarUint(){var t,e=0;do{e=(e<<7)+(127&(t=this.readUint8()))}while(128==(128&t));return e}skip(t){this.byteOffset+=t}readChunk(){var t=this.readString(4),e=this.readUint32(),i=this.byteOffset;return this.byteOffset+=e,{id:t,length:e,data:this.data.slice(i,this.byteOffset).buffer}}readEvent(){var t={};t.delta=this.readVarUint();var e=this.readUint8();if(240==(240&e))switch(e){case 255:t.type="meta";var i=this.readUint8(),s=this.readVarUint();switch(i){case 0:t.subType="sequenceNumber",2===s?t.value=this.readUint16():this.skip(s);break;case 1:t.subType="text",t.value=this.readString(s);break;case 2:t.subType="copyrightNotice",t.value=this.readString(s);break;case 3:t.subType="trackName",t.value=this.readString(s);break;case 4:t.subType="instrumentName",t.value=this.readString(s);break;case 5:t.subType="lyrics",t.value=this.readString(s);break;case 6:t.subType="marker",t.value=this.readString(s);break;case 7:t.subType="cuePoint",t.value=this.readString(s);break;case 32:t.subType="midiChannelPrefix",1===s?t.value=this.readUint8():this.skip(s);break;case 47:t.subType="endOfTrack",s>0&&this.skip(s);break;case 81:t.subType="setTempo",3===s?t.value=this.readUint24():this.skip(s);break;case 84:if(t.subType="smpteOffset",5===s){var a=this.readUint8();t.value={frameRate:{0:24,1:25,2:29.97,3:30}[a>>>6],hour:63&a,minute:this.readUint8(),second:this.readUint8(),frame:this.readUint8(),subFrame:this.readUint8()}}else this.skip(s);break;case 88:t.subType="timeSignature",4===s?t.value={numerator:this.readUint8(),denominator:1<<this.readUint8(),metronome:this.readUint8(),thirtyseconds:this.readUint8()}:this.skip(s);break;case 89:t.subType="keySignature",2===s?t.value={key:this.readInt8(),scale:this.readUint8()}:this.skip(s);break;case 127:t.subType="sequencerSpecific",t.value=this.readString(s);break;default:t.subType="unknown",t.value=this.readString(s)}break;case 240:t.type="sysEx";s=this.readVarUint();t.value=this.readString(s);break;case 247:t.type="dividedSysEx";s=this.readVarUint();t.value=this.readString(s);break;default:t.type="unknown";s=this.readVarUint();t.value=this.readString(s)}else{var r;0==(128&e)?(r=e,e=this.lastEventTypeByte):(r=this.readUint8(),this.lastEventTypeByte=e);var n=e>>4;switch(t.channel=15&e,t.type="channel",n){case 8:t.subType="noteOff",t.value={noteNumber:r,velocity:this.readUint8()};break;case 9:t.value={noteNumber:r,velocity:this.readUint8()},0===t.value.velocity?t.subType="noteOff":t.subType="noteOn";break;case 10:t.subType="noteAftertouch",t.value={noteNumber:r,amount:this.readUint8()};break;case 11:t.subType="controller",t.value={controllerNumber:r,controllerValue:this.readUint8()};break;case 12:t.subType="programChange",t.value=r;break;case 13:t.subType="channelAftertouch",t.value=r;break;case 14:t.subType="pitchBend",t.value=r+(this.readUint8()<<7);break;default:t.subType="unknown",t.value=(r<<8)+this.readUint8()}}return t}}class Timer{constructor(t){this.ticksPerBeat=t,this.criticalPoints=[]}addCriticalPoint(t,e){this.criticalPoints.push({delta:t,microsecondsPerBeat:e})}getTime(t){let e=0,i=5e5;for(let s,a=0;a<this.criticalPoints.length&&t>0;a++)t>=(s=this.criticalPoints[a]).delta?(e+=s.delta*i/this.ticksPerBeat/1e6,t-=s.delta):(e+=t*i/this.ticksPerBeat/1e6,t=0),i=s.microsecondsPerBeat;return e+=t*i/this.ticksPerBeat/1e6}}function fromNowIWillGoFuture(t,e={}){const i=new WhyYouHateMe(t),s=i.readChunk();if("MThd"!==s.id||6!==s.length)throw new SyntaxError("malformed header");const a=new WhyYouHateMe(s.data),r=(a.readUint16(),a.readUint16()),n=a.readUint16(),h=[],l=[],o=[];let u;for(let t=0;t<r;t++){const s=i.readChunk();if("MTrk"!==s.id)continue;const a=new WhyYouHateMe(s.data),r=[];let n=!0;for(;n&&a.byteOffset<s.length;){let t=a.readEvent();if(r.push(t),"string"==typeof t.value&&Array.isArray(e.Skip))for(let i=0;i<e.Skip.length;i++)if(e.Skip[i][t.subType]===t.value){n=!1;break}}"function"==typeof e.Skip&&(n=!e.Skip(r)),n?h.push(r):e.verbose&&console.log(`skipping track ${t+1}...`)}if(n>>>15!=0)return console.log("Detected unsupported MIDI timing mode"),null;{const t=new Timer(n);for(let e,i=0,s=0,a=0;i<h[0].length;i++)s+=(e=h[0][i]).delta,a+=e.delta,"setTempo"===e.subType&&(t.addCriticalPoint(s,e.value),s=0);for(let e=0;e<h.length;e++){let i=h[e],s=0,a=new Map;for(let e=0;e<i.length;e++){let r=i[e];if(s+=r.delta,"channel"===r.type){const e=r.value.noteNumber;if("noteOn"===r.subType){let i=r.value.velocity,n=t.getTime(s);a.has(e)?a.get(e).push({offset:n,velocity:i}):a.set(e,[{offset:n,velocity:i}]),o.push({velocity:i,delta:s,note:!0})}else if("noteOff"===r.subType){let i=a.get(e).pop();l.push({note:YouKnowMe.note(e),time:t.getTime(s)-i.offset,amplitude:i.velocity/128,offset:i.offset}),o.push({velocity:i.velocity,delta:s,note:!1})}}}}o.sort(function(t,e){return t.delta-e.delta||t.note-e.note});let e=1,i=0,s=1,a=0,r=0,d=0;for(const n of o)n.note?(s+=n.velocity,d++,s>e&&(e=s,i=t.getTime(n.delta)),d>a&&(a=d,r=t.getTime(n.delta))):(s-=n.velocity,d--);u=128/e}const d=new YouKnowMe;return d.writeProgression(l,u,[0],!0,!0),d}
function IllustionOfMilkyWay(url,callback) {
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';
  req.onload = function() {
    callback(req.response);
  }
  req.send();
};

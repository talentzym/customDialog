export default class Dialog extends EventTarget{
  constructor({
    width = "30%",
    height = "250px",
    title = "测试标题",
    content = "测试内容",
    dragable = true, //是否可拖拽
    maskable = true, //是否有遮罩
    isCancel = false, //是否有取消
    cancel = function(){},
    success = function(){}
} = options){
    super()
    // console.log(options);
    this.width = width
    this.height = height
    this.title = title
    this.content = content
    this.dragable = dragable
    this.maskable = maskable, //是否有遮罩
    this.isCancel = isCancel, //是否有取消
    this.cancel = cancel,
    this.success = success

    this.init()
  }

  init () {
    this.createHtml()
    if (!this.maskable) {
      this.dialogEle.querySelector('.k-wrapper').style.display = "none"
    }
    if (this.dragable) {
      this.drag()
    }

    // 绑定自定义事件
    this.addEventListener("success", this.success)

    // 事件委托
    let kdialog = this.dialogEle.querySelector('.k-dialog')
    kdialog.addEventListener('click', e=>{
      // console.log(e);
      let className = e.target.className
      // console.log(className);
      switch (className) {
        case 'k-close':
          this.close()
          this.cancel()
          break
        case 'k-default':
          this.close()
          this.cancel()
          break
        case 'k-primary':
          this.close()
          this.sure()
          break
      }
    })
  }
  sure(value){
    this.dispatchEvent(new CustomEvent("success", {
      detail: value
    }))
  }
  createHtml () {
    let dialogEle = document.createElement("div")
    dialogEle.innerHTML = `<div class="k-wrapper"></div>
    <div class="k-dialog" style="width:${this.width};height:${this.height};">
        <div class="k-header">
            <span class="k-title">${this.title}</span><span class="k-close">X</span>
        </div>
        <div class="k-body">
            <span>${this.content}</span>
        </div>
        <div class="k-footer">
            ${this.isCancel ? '<span class="k-default">取消</span>' : ''}
            <span class="k-primary">确定</span>
        </div>
    </div>`
    dialogEle.style.display = "none"
    this.dialogEle = dialogEle
    document.querySelector("body").appendChild(dialogEle)
  }
  open () {
    this.dialogEle.style.display = "block"
  }
  close() {
    this.dialogEle.style.display = "none"
  }
  drag(){
    let kdialog = this.dialogEle.querySelector('.k-dialog')
    kdialog.onmousedown = e=>{
      let x = e.clientX - kdialog.offsetLeft
      let y = e.clientY - kdialog.offsetTop
      kdialog.onmousemove = e=>{
        let xx = e.clientX - x
        let yy = e.clientY - y
        kdialog.style.left = xx + 'px'
        kdialog.style.top = yy + 'px'
      }
    }
    kdialog.onmouseup = ()=>{
      kdialog.onmousemove = ""
    }
  }
}

export class ExtendsDialog extends Dialog {
  constructor(options){
    
    super(options)
  }
  createHtml(){
    super.createHtml();
    let myinput = document.createElement('input')
    myinput.classList.add('input-inner')
    this.myinput =myinput
    this.dialogEle.querySelector('.k-body').appendChild(myinput)
  }
  sure(){
    let value = this.myinput.value
    // console.log(value);
    super.sure(value)
  }
}

class ShowDialog extends HTMLElement{
  constructor () {
    super()
    console.log(this);
    this.innerHTML = `<button>${this.innerText}</button>`
    let dialog = new Dialog({
      title: this.title,
      success: e => {
        this.dispatchEvent(new CustomEvent("confim"))
      }
    })
    this.onclick=()=>{
      dialog.open()
    }
  }
  get title () {
    return this.getAttribute("title") || "默认标题"
  }
  get width(){
    return this.getAttribute("width") || "30%"
  }
}

customElements.define("show-dialog",ShowDialog)
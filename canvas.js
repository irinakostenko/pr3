function canvas(selector, options){
   const canvas = document.querySelector(selector);
   canvas.classList.add('canvas')
   canvas.setAttribute('width', `${options.width || 400}px`)
   canvas.setAttribute('height', `${options.height || 300}px`)


   // отримання контексту для малювання
   const context = canvas.getContext('2d')
  // отримуємо координати canvas відносно viewport
   const rect = canvas.getBoundingClientRect();

   let isPaint = false // чи активно малювання
   let points = []
   let brushColor = document.getElementById("brushColor").value
   console.log(brushColor)
   let brushSize = document.getElementById("brushSize").value;
   
    // об’являємо функцію додавання точок в масив
const addPoint = (x, y, dragging) => {
   // преобразуємо координати події кліка миші відносно canvas
   points.push({
       x: (x - rect.left),
       y: (y - rect.top),
       dragging: dragging,
       color: brushColor,
       size: brushSize
   })
}

     // головна функція для малювання
     const redraw = () => {
      context.strokeStyle = brushColor;
      context.lineJoin = "round";
      context.lineWidth = brushSize;
      let prevPoint = null;
      for (let point of points){
          if(point.color === brushColor && point.size === brushSize) {
              context.beginPath();
              if (point.dragging && prevPoint) {
                  context.moveTo(prevPoint.x, prevPoint.y)
              } else {
                  context.moveTo(point.x - 1, point.y);
              }
              context.lineTo(point.x, point.y)
              context.closePath()
              context.stroke();
              prevPoint = point;
          }
      }
  }
   

     // функції обробники подій миші
const mouseDown = event => {
   isPaint = true
   addPoint(event.pageX, event.pageY);
   redraw();
}

const mouseMove = event => {
   if(isPaint){
       addPoint(event.pageX, event.pageY, true);
       redraw();
   }
}

// додаємо обробку подій
canvas.addEventListener('mousemove', mouseMove)
canvas.addEventListener('mousedown', mouseDown)
canvas.addEventListener('mouseup',() => {
   isPaint = false;
});
canvas.addEventListener('mouseleave',() => {
   isPaint = false;
});


// TOOLBAR
const toolBar = document.getElementById('toolbar')
// clear button
let clearButton;
clearButton = createBtn('<i class="fas fa-broom"></i>', toolBar)
clearButton.addEventListener('click', () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    points = [];
})


   let DownloadButton;
   DownloadButton = createBtn('<i class="fas fa-download"></i>', toolBar)
   DownloadButton.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
   })

   let saveButton;
   saveButton = createBtn('<i class="fas fa-save"></i>', toolBar)
   saveButton.addEventListener('click', () => {
       localStorage.setItem('points', JSON.stringify(points))
   })

      let restoreButton;
      restoreButton = createBtn('<i class="fas fa-upload"></i>', toolBar)
      restoreButton.addEventListener('click', () => {
         points = JSON.parse(localStorage.getItem('points'))
         redraw();
      })

   let timeButton;
   timeButton = createBtn('<i class="fas fa-clock"></i>', toolBar)
   timeButton.addEventListener('click', () => {
       var date = new Date()
       date.toISOString().substring(0,10)
       context.fillText(date,10,10)
       context.fillStyle = "white"
   })

   let colorButton;
   colorButton = createBtn('<i class="fas fa-palette"></i>', toolBar)
   colorButton.addEventListener('click', () => {
       brushColor = document.getElementById("brushColor").value;
   })

   let sizeButton
   sizeButton = createBtn('<i class="fas fa-brush"></i>', toolBar)
   sizeButton.addEventListener('click', () => {
       brushSize = document.getElementById("brushSize").value;
   })

}

function createBtn (inner,toolbar){
   let name = document.createElement('button')
   name.classList.add('btn')
   name.innerHTML = inner
   toolbar.insertAdjacentElement('afterbegin', name)
   return name
}

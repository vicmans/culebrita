window.addEventListener('load',init,false);
var canvas=null,ctx=null;
var lastPress=null;
var pause=true,gameover=true;
var dir=0,score=0;
var body=new Array();
var food=new Rectangle(80,80,10,10);
//var wall=new Array();
var iBody=new Image(),iFood=new Image();
var aEat=new Audio(),aDie=new Audio();
var music = new Audio();
iBody.src='media/body.png';
iFood.src='media/fruit.png';
aDie.src='media/chomp.m4a';
aEat.src='media/dies.m4a';
music.src='media/music.m4a';
//wall.push(new Rectangle(100,50,10,10));
//wall.push(new Rectangle(100,100,10,10));
//wall.push(new Rectangle(200,50,10,10));
//wall.push(new Rectangle(200,100,10,10));
var ch = document.getElementById("check");
var KEY_ENTER=13;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;

function random(max){
    return Math.floor(Math.random()*max);
}

function init(){
    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');
    run();
    repaint();
}

function run(){
    setTimeout(run,50);
    act();
}

function repaint(){
    requestAnimationFrame(repaint);
    paint(ctx);
}

function reset(){
    score=0;
    dir=1;
    body.length=0;
    body.push(new Rectangle(40,40,10,10));
    body.push(new Rectangle(0,0,10,10));
    body.push(new Rectangle(0,0,10,10));
    food.x=random(canvas.width/10-1)*10;
    food.y=random(canvas.height/10-1)*10;
    gameover=false;
}

function act(){
    if(!pause){
        // GameOver Reset
        if(gameover){
            reset();music.pause();}
		if(ch.checked){music.play();}else{music.pause();}
        // Move Body
        for(var i=body.length-1;i>0;i--){
            body[i].x=body[i-1].x;
            body[i].y=body[i-1].y;
        }
     
        // Change Direction
        if(lastPress==KEY_UP&&dir!=2)
            dir=0;
        if(lastPress==KEY_RIGHT&&dir!=3)
            dir=1;
        if(lastPress==KEY_DOWN&&dir!=0)
            dir=2;
        if(lastPress==KEY_LEFT&&dir!=1)
            dir=3;

        // Move Head
        if(dir==0)
            body[0].y-=10;
        if(dir==1)
            body[0].x+=10;
        if(dir==2)
            body[0].y+=10;
        if(dir==3)
            body[0].x-=10;

        // Out Screen
        if(body[0].x>canvas.width-body[0].width)
            body[0].x=0;
        if(body[0].y>canvas.height-body[0].height)
            body[0].y=0;
        if(body[0].x<0)
            body[0].x=canvas.width-body[0].width;
        if(body[0].y<0)
            body[0].y=canvas.height-body[0].height;
     
        // Wall Intersects
        //for(var i=0,l=wall.length;i<l;i++){
        //    if(food.intersects(wall[i])){
        //        food.x=random(canvas.width/10-1)*10;
        //        food.y=random(canvas.height/10-1)*10;
        //    }
        //  
        //    if(body[0].intersects(wall[i])){
        //        gameover=true;
        //        pause=true;
        //    }
        //}
     
        // Body Intersects
        for(var i=2,l=body.length;i<l;i++){
            if(body[0].intersects(body[i])){
                gameover=true;
                pause=true;
                aDie.play();
            }
        }
     
        // Food Intersects
        if(body[0].intersects(food)){
            body.push(new Rectangle(food.x,food.y,10,10));
            score++;
            food.x=random(canvas.width/10-1)*10;
            food.y=random(canvas.height/10-1)*10;
            aEat.play();
        }
    }
    // Pause/Unpause
    if(lastPress==KEY_ENTER){
        pause=!pause;
        lastPress=null;
    }
}

function paint(ctx){
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0f0';
    for(var i=0,l=body.length;i<l;i++){
        body[i].fill(ctx);
        //ctx.drawImage(iBody,body[i].x,body[i].y);
    }
    //ctx.fillStyle='#999';
    //for(var i=0,l=wall.length;i<l;i++){
    //    wall[i].fill(ctx);
    //}
    //ctx.fillStyle='#f00';
    //food.fill(ctx);
    ctx.drawImage(iFood,food.x,food.y);
 
    ctx.fillStyle='#fff';
    //ctx.fillText('Last Press: '+lastPress,0,20);
    ctx.fillText('Score: '+score,0,10);
    if(pause){
        ctx.textAlign='center';
		
		if(gameover)
            ctx.fillText('GAME OVER',150,75);
        else
            ctx.fillText('PAUSE',150,75);
        ctx.textAlign='left';
    }
}

document.addEventListener('keydown',function(evt){
    lastPress=evt.keyCode;
},false);

function Rectangle(x,y,width,height){
    this.x=(x==null)?0:x;
    this.y=(y==null)?0:y;
    this.width=(width==null)?0:width;
    this.height=(height==null)?this.width:height;
 
    this.intersects=function(rect){
        if(rect!=null){
            return(this.x<rect.x+rect.width&&
                this.x+this.width>rect.x&&
                this.y<rect.y+rect.height&&
                this.y+this.height>rect.y);
        }
    }
 
    this.fill=function(ctx){
        if(ctx!=null){
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    }
}

window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback){window.setTimeout(callback,17);};
})();

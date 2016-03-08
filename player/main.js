/**
 * Created by dell1 on 2016/3/7.
 */
$(function(){
    var oA=document.getElementById('audio');
    var oPlay=$('.play');
    var oPause=$('.pause');
    var pl=function(){
        oPlay.hide();
        oPause.show();
    };
    var pause=function(){
        oPlay.show();
        oPause.hide();
    };
    //播放、暂停、停止
    oPlay.click(function(){
        oA.play();
        pl();
    });
    oPause.click(function(){
        oA.pause();
       pause();
    });
    //播放进度
    var oHandle2=$('.tracker .handle');
    var oRange2=$('.tracker .range');
    oA.ontimeupdate=function(){
        var scale=oA.currentTime/oA.duration;
        oRange2.css({'width':scale*100+'%'});
    };
    if(oA.fastSeek){
        alert(1);
    }
    oHandle2.mousedown(function(ev){
        var disX=ev.clientX-oHandle2.position().left;
        $(document).bind('mousemove',fnmove);
        function fnmove(ev){
                var l=ev.clientX-disX;
                var scale=l/(oRange2.parent().width()-oHandle2.width());
                oRange2.css({width:scale*100+'%'});
                oA.currentTime=oA.duration*scale;
                console.log(oA.duration*scale);

        }
        function fnup() {
            $(document).unbind('mousemove',fnmove);
            $(document).unbind('mouseup',fnup);
            oA.play();
            pl();
        }
        $(document).bind('mouseup',fnup);
        return false;
    });
    //音量
    var oHandle1=$('.volume .handle');
    var oRange1=$('.volume .range');

    oHandle1.mousedown(function(ev){
        var disX=ev.clientX-oHandle1.position().left;

        $(document).bind('mousemove',fndown);
        function fndown(ev){
            var l=ev.clientX-disX;
            var scale=l/(oRange1.parent().width()-oHandle1.width());

            scale<0 && (scale=0);
            scale>1 && (scale=1);
            oRange1.css({width:scale*100+'%'});
            oA.volume=scale;
        }
        function fnup() {
            $(document).unbind('mousemove',fndown);
            $(document).unbind('mouseup',fnup);
        }
        $(document).bind('mouseup',fnup);
        return false;
    });
    //开始
    var iNow=0;
    /*
     * 1 -> 单曲循环
     * 2 -> 顺序播放
     * 3 -> 随机播放
     * */
    var playState=2;
    var arrSong=['The Dawn',
        '千千阙歌',
        '时间都去哪儿了',
        '小苹果'];
    function rnd(n,m){
        return parseInt(Math.random()*(m-n))+n;
    }
    var aSong=$('.playlist li a');
    aSong.each(function(index){
        aSong.eq(index).click(function(){
            iNow=index;
            tab();
        })
    });
    function tab(){
        oA.src='songs/'+arrSong[iNow]+'.mp3';
        oA.play();
        pl();
        aSong.removeClass('on');
        aSong.eq(iNow).addClass('on');
    }
    oA.onended=function(){
        switch (playState){
            case 1:
                tab();
                break;
            case 2:
                iNow++;
                if(iNow==arrSong.length) {
                   iNow=0;
                    tab();
                }
                break;
            case 3:
                iNow=rnd(0,arrSong.length);
                tab();
                break;
        }
    };
    //播放模式
    var aModeBtn=$('.title span');
    aModeBtn.eq(1).click(function(){
        aModeBtn.removeClass('red');
        $(this).addClass('red');
        playState=1;
    });
    aModeBtn.eq(2).click(function(){
        aModeBtn.removeClass('red');
        $(this).addClass('red');
        playState=2;
    });

    aModeBtn.eq(3).click(function(){
        aModeBtn.removeClass('red');
        $(this).addClass('red');
        playState=3;
    });
    //next
    var oPrev=$('.rew');
    var oNext=$('.fwd');
    oNext.click(function(e){
        e.preventDefault();
        pause();
        switch (playState){
            case 1:
                pl();
                tab();
                break;
            case 2:
                iNow++;
                if(iNow==arrSong.length) {
                    iNow=0;

                }
                tab();
                break;
            case 3:
                iNow=rnd(0,arrSong.length);
                pl();
                tab();
                break;
        }
    });
    oPrev.click(function(e){
        e.preventDefault();
        pause();
        switch (playState){
            case 1:
                pl();
                tab();
                break;
            case 2:
                iNow--;
                if(iNow==-1){
                    iNow=arrSong.length-1;
                }
                pl();
                tab();
                break;
            case 3:
                iNow=rnd(0,arrSong.length);
                pl();
                tab();
                break;
        }
    });
    //add
    var oAdd=$('#addFiles');
    var oPlist=$('.playlist');
    oAdd.select();
    oAdd.change(function(ev){
        var aFile=ev.srcElement.files;
        if (aFile.length !== 0) {
            $(aFile).each(function(index){
                var name=$(aFile).eq(index).attr('name');
                console.log(oAdd.attr('value'));
                var end=name.lastIndexOf('.');
                var oLi=$('<li><a href="javascript:;">'+name.substring(0,end)+'</a></li>');
                oLi.appendTo(oPlist);
                arrSong.push(name.substring(0,end));
            });
            aSong=$('.playlist li a');
            aSong.each(function(index){
                aSong.eq(index).click(function(){
                    console.log(1);
                    iNow=index;
                    tab();
                })
            });
        }
    });

});
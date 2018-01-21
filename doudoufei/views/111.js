   function seek(){
        var seek = $("#hunt").val();
        console.log($("#hunt").val())
        gain(seek)
    }
    
    //每次点击下拉列表都会触发这个函数，改变当前页，然后触发ajax函数
    function tiaoye(){
        $(".dangqian").html($(".yema").find("option:selected").text()||1)
        gain()
    }
    //点击跳转起始页和末尾页
    function fipage(num){
        $(".dangqian").html(num||$(".yema option:last").val())
        gain()
    }
    //点击跳转上一页和下一页
    function endpage(num){
        if($(".dangqian").html()*1+num>$(".yema option:last").val()){
            alert("已经是最后一页")
        }else if($(".dangqian").html()*1+num==0){
            alert("已经是第一一页")
        }else{
            $(".dangqian").html($(".dangqian").html()*1+num)
            gain()
        }
    }
    // console.log($(".yema").find("option:selected").text())
    //ajax向后台发送数据，再返还想要的数据
    function gain(seek){
        $.ajax({
            url:"/goods",
            type:"get",
            data:{
                condition: seek||"",
                pagenum : $(".dangqian").html(),
                listnum : $(".listnum").val()
            },
            //返回的数据
            success:function(res){
                console.log(res)
                var ss = $(".listnum").val()
                var len = res.zong;                      //总数
                var res = res.data;                      //总商品信息
                // var sele=  
                var selelen = Number(Math.ceil(len/ss))  //有多少页
                var dq = $(".dangqian").html()           //当前页面的值
                $(".zj").html(len)                       //总个数
                $(".ym").html(selelen)                    //页码值
                //每次ajax调取都清除一下下拉列表，再创建。
                $(".yema option").remove()
                for(j=0;j<selelen;j++){
                    var s= j+1;
                    var sele = 
                    `<option value="${s}" aa="2">${s}</option>`
                    $(".yema").append(sele)
                    //默认选中的option，和当前页相关联
                    $(".yema option[value="+dq+"]").attr("selected",true);
                }
                //每次ajax调取都清除一下商品表格，再创建。
                $(".l-gain").remove()
                for(i=0;i<len;i++){
                    var td=`
                    <tr class="l-gain">
                        <td><input type="checkbox"/>${res[i].id}</td>
                        <td>${res[i].goodsname}</td>
                        <td class="cen">${res[i].goodsnumber}</td>
                        <td class="cen">${res[i].price}</td>
                        <td class="cen">${res[i].putaway}</td>
                        <td class="cen">${res[i].jingpin}</td>
                        <td class="cen">${res[i].newgoods}</td>
                        <td class="cen">${res[i].hot}</td>
                        <td class="cen">${res[i].sort}</td>
                        <td class="cen">${res[i].kucun}</td>
                        <td class="cen">${res[i].virtual}</td>
                        <td class="cen">
                            <a  href="javascript:viod(0)">
                                <img src="../images/add-goods/icon_view.gif" />
                            </a>
                            <a  href="javascript:viod(0)">
                                <img src="../images/add-goods/icon_edit.gif"/>
                            </a>
                            <a  href="javascript:viod(0)">
                                <img src="../images/add-goods/icon_copy.gif"/>
                            </a>
                            <a  href="javascript:viod(0)">
                                <img src="../images/add-goods/icon_trash.gif"/>
                            </a>
                            <img src="../images/add-goods/empty.gif"/>
                        </td>
                    </tr>`
                    $(".l-goods").append(td)
                }
            }

        })
    }

    //class名对应的标签
    // $("#hunt") 关键字 <input id="hunt"> 搜索
    // $(".dangqian") 当前第几页<span class="dangqian">
    // $(".yema") 下拉列表<select>标签
    // $(".listnum") 表单一页多少数量
    // $(".zj") 总计，总计多少个记录
    // $(".ym") 一共分了几页
    // $(".l-gain") 动态创建的下拉列表<option>标签

router.get('/goods', function(req, res, next) {
  var condition = req.query.condition          //模糊查询的商品名
  var pagenum = parseInt(req.query.pagenum)    //当前页码数
  var listnum = parseInt(req.query.listnum)    //一页显示多少商品
  //count 查询的一共有多少个商品，数量
  GoodsModel.count({goodsname:{$regex:condition}},function(err,count){
    // console.log(count)
    //数据库中模糊查找到的商品，   skip以后是分页显示 
    var query = GoodsModel.find({goodsname:{$regex:condition}}).skip((pagenum-1)*listnum).limit(listnum)
    //拿到值向前端发送
    query.exec(function(err,doce){
      console.log(doce.length)
      //状态码和发送的内容
      var result={
        code:1,
        zong:count,
        data:doce,
        pagenum:pagenum,
      }  
      //判断是否有数据  
      if(doce.length>0){
        res.json(result)
        return
      }else{
        result.code=0;
        res.json(result)
        res.end()
      }
    })
  })
});





    function search(){
        var search = $("#search").val();
        console.log($("#search").val())
        menu(search)
    }
    function page(){
        $("#pageCurrent").html($("#gotoPage").find("option:selected").text()||1)
        menu();
    }
    function home(num){
        $("#pageCurrent").html(num||$("#gotoPage option:last").val())
        menu();
    }
    function endpage(num){
        if($("#pageCurrent").html()*1+num>$("#gotoPage option:last").val()){
            alert("已经是最后一页")
        }else if($("#pageCurrent").html()*1+num==0){
            alert("已经是第一页")
        }else{
            $("#pageCurrent").html($("#pageCurrent").html()*1+num)
            gain()
        }
    }
    function menu(search){
        $.ajax({
            url:"/goods",
            type:"get",
            data:{
                condition: search||"",
                pagenum : $("#pageCurrent").html(),
                listnum : $("#pageSize").val()
            },
            success:function(res){
                console.log(res.length)
                var ss = $("#pageSize").val()
                var len = res.zong;
                var res = res.data;
                var selelen = Number(Math.ceil(len/ss))
                var dq = $("#pageCurrent").html()
                $("#totalRecords").html(len)   
                $("#totalPages").html(selelen) 
                $("#gotoPage option").remove()
                for(j = 0;j<selelen;j++){
                    var s = j+1;
                    var select = `<option value="${s}" aa="2">${s}</option>`
                    $("#gotoPage").append(select)
                    $("#gotoPage option[value="+dq+"]").attr("selected",true);
                }
                $(".l-gain").remove()
                for(i=0;i<len;i++){
                    console.log(res[i])
                    var td=`
                    <tr class="tr">
                        <td style="background-color:rgb(255, 255, 255)" class="first-cell"><input type="checkbox"/>${res[i]._id}</td>
                        <td style="background-color:rgb(255, 255, 255)">${res[i].goods_name}</td>
                        <td style="background-color:rgb(255, 255, 255)" align="center">${res[i].goods_sn}</td>
                        <td style="background-color:rgb(255, 255, 255)" align="center">${res[i].price}</td>
                        <td style="background-color:rgb(255, 255, 255)" align="center"><img src="/images/yes.gif" /></td>
                        <td style="background-color:rgb(255, 255, 255)" align="center"><img src="/images/no.gif" /></td>
                        <td style="background-color:rgb(255, 255, 255)" align="center"><img src="/images/no.gif" /></td>
                        <td style="background-color:rgb(255, 255, 255)" align="center"><img src="/images/no.gif" /></td>
                        <td style="background-color:rgb(255, 255, 255)" align="center"><img src="/images/yes.gif" /></td>
                        <td style="background-color:rgb(255, 255, 255)" align="center"></td>
                        <td style="background-color:rgb(255, 255, 255)" align="center">${res[i].virtual_sales}</td>
                        <td style="background-color:rgb(255, 255, 255)" align="center">
                            <a  href="">
                                <img src="/images/icon_view.gif" />
                            </a>
                            <a  href="/add_goods2">
                                <img src="/images/icon_edit.gif"/>
                            </a>
                            <a  href="">
                                <img src="/images/icon_copy.gif"/>
                            </a>
                            <a id="remove"  href="">
                                <img src="/images/icon_trash.gif"/>
                            </a>
                        </td>
                    </tr>`
                    $(".l-list").append(td)
                }
            }
        })
    }





// function key(){
//         var keyWord = $("#search").val();
//         console.log($("#search").val())
//         deliver(keyWord)
//     }

// var keyWord=1
// deliver(keyWord)

function change(){

        $("#pageCurrent").html($("#gotoPage").find("option:selected").text()||1)
        deliver()
    }

 //点击跳转起始页和末尾页
 function fipage(num){
  
        $("#pageCurrent").html(num||$("#gotoPage option:last").val())
        console.log($("#pageCurrent").html())
        deliver()
    }
    function endPage(num){
        if($("#pageCurrent").html()*1+num>$("#gotoPage option:last").val()){
            alert("已经是最后一页")
        }else if($("#pageCurrent").html()*1+num==0){
            alert("已经是第一一页")
        }else{
            $("#pageCurrent").html($("#pageCurrent").html()*1+num)
            console.log($("#pageCurrent").html())
            deliver()
        }
    }
    deliver()


  function deliver(){

        $.ajax({
            url:"/goods",
            type:"get",
            data:{
              condition:1,
              perPageCnt:$("#pageSize").val(),
              pageNO : $("#pageCurrent").html()
            },
            success:function(res){
              
              // var data=res.data
              //   console.log(data)
              //   var len = data.length
              //   $("#totalRecords").html(len)
              console.log(res)
                var perPageCnt = $("#pageSize").val()
                var count = res.total;                      //总数
                var data = res.data; 
                                     //总商品信息
                // var sele=  
                var allPage = Number(Math.ceil(count/perPageCnt))  //有多少页
                var nowPage = $("#pageCurrent").html()
                    //当前页面的值
                $("#totalRecords").html(count)                       //总个数
                $("#totalPages").html(allPage)                    //页码值
                //每次ajax调取都清除一下下拉列表，再创建。
                 $("#gotoPage option").remove()
                for(j=0;j<allPage;j++){
                    var s= j+1;
                    var sele = 
                    `<option value="${s}" >${s}</option>`
                    $("#gotoPage").append(sele)
                    //默认选中的option，和当前页相关联
                      $("#gotoPage option[value="+nowPage+"]").attr("selected",true);
                }
               // 每次ajax调取都清除一下商品表格，再创建。
                $(".goods-list").remove()

                for(var i in data){
                    console.log(data[i])
                    var td=`
                    <tr class="goods-list">
                        <td class="tabel-first"><input type="checkbox"/>${data[i]._id}</td>
                        <td>${data[i].goodsName}</td>
                        <td class="cen">${data[i].goodsNumber}</td>
                        <td class="cen">${data[i].price}</td>
                        <td class="change"><img src="/images/yes.gif" /></td>
                        <td class="change"><img src="/images/no.gif" /></td>
                        <td class="change"><img src="/images/no.gif" /></td>
                        <td class="change"><img src="/images/yes.gif" /></td>
                        <td class="cen">6767</td>
                        <td class="cen">6464</td>
                        <td class="cen">${data[i].goodsCount}</td>
                        <td class="cen">
                            <a  href="javascript:viod(0)">
                                <img src="/images/icon_view.gif" />
                            </a>
                            <a  href="javascript:viod(0)">
                                <img src="/images/icon_edit.gif"/>
                            </a>
                            <a  href="javascript:viod(0)">
                                <img src="/images/icon_copy.gif"/>
                            </a>
                            <a  href="javascript:viod(0)">
                                <img id="dele" src="/images/icon_trash.gif"/>
                            </a>
                        </td>
                    </tr>`
                    $(".l-list").append(td)
                }
                // $("#dele").on("click",function(){
                //   if(confirm("您确实要把该商品放入回收站吗？")){
                    
                //       $.ajax({
                //           url:"/dele",
                //           type:"get",
                //           data:{

                //           },
                //           success:function(res){

                //           }
                //         })
                //   }else{
                //     console.log("sdf")
                //    }
                // })
            }

        })
    }



//选项卡
document.getElementById("tabbar-div").onclick = function(e) {
    var obj = Utils.srcElement(e);

    if(obj.className == "tab-front" || obj.className == '' || obj.tagName.toLowerCase() != 'span') {
        return;
    } else {
        objTable = obj.id.substring(0, obj.id.lastIndexOf("-")) + "-table";

        var tables = document.getElementsByTagName("table");
        var spans = document.getElementsByTagName("span");

        for(i = 0; i < tables.length; i++) {
            if(tables[i].id == objTable) {
                tables[i].style.display = (Browser.isIE) ? "block" : "table";
            } else {
                var tblId = tables[i].id.match(/-table$/);

                if(tblId == "-table") {
                    tables[i].style.display = "none";
                }
            }
        }
        for(i = 0; spans.length; i++) {
            if(spans[i].className == "tab-front") {
                spans[i].className = "tab-back";
                obj.className = "tab-front";
                break;
            }
        }
    }
}
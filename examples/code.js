var _$_5=this;
debugger;
var _$_6=[];
var _$_7=_$_2.push(_$_6);
with(_$_1){
    try{
        _$_7(_$_2.escape(_$_2.ify(a ? a + '!!'  '')));
        _$_7();
    }catch(_$_10){
        throw _$_4.call(_$_5,_$_10,0);
    }
    _$_7("\n");
    _$_7("\n");
    try{
        _$_7(_$_2.escape(_$_2.ify(b || "c")));
        _$_7();
    }catch(_$_11){
        throw _$_4.call(_$_5,_$_11,3);
    }
    _$_7("\n");
}
return _$_2.trim(_$_6.join(""));
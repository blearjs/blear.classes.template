debugger;
var _$_4="";
with(_$_0){
    try{
        _$_4+=_$_1.escape(_$_1.ify(Date.now()));
        ;
    }catch(_$_5){
        throw _$_3(_$_5, {});
    }
    _$_4+="\n";
    _$_4+="\n";
    try{
        if(false){
            _$_4+="\n";
            _$_4+="1";
            _$_4+="\n";
        }
    }catch(_$_6){
        throw _$_3(_$_6, {"file":null,"start":16,"end":29,"line":2});
    }
    try{
        if(null&&!(false)){
            _$_4+="\n";
            _$_4+="2";
            _$_4+="\n";
        }
    }catch(_$_7){
        throw _$_3(_$_7, {"file":null,"start":32,"end":49,"line":4});
    }
    try{
        if(!(false&&null)){
            _$_4+="\n";
            _$_4+="3";
            _$_4+="\n";
        }
    }catch(_$_8){
        throw _$_3(_$_8, {"file":null,"start":32,"end":49,"line":4});
    }
    _$_4+="\n";
}
return _$_1.trim(_$_4);
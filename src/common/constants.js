var ebi = {
    message : {
        type : {
            none : 99
            log : 0,
            exception: 1,
            script : 2,
            result : 3,
            requestHTML : 4,
            sendHTML : 5,
        },
        origin : {
            unkown: 99,
            client : 0,
            server : 1,
            console : 2
        },
        last : 0
    },
    createMessageObject : function(){
        return {
            id : this.message.last++,
            type : this.message.type.none,
            msg : "",
            origin : this.message.type.unkown,
            time : this.createTimeString( new Date())
        };
    },
    createTimeString : function( date){
        var hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(), msec = date.getMilliseconds();
	      if( hour < 10){ hour = "0" + hour; }
	      if( min < 10){ min = "0" + min; }
	      if( sec < 10){ sec = "0" + sec; }
        if( msec < 10){ msec = "0" + msec; }
        if( msec < 100){ msec = "0" + msec; }
        return hour + ":" + min + ":" + sec + "." + msec;
    }
}
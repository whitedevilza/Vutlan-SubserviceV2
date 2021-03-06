/* <-- Rattapum Puttaraksa --> */
/* Used net-snmp library */
// Copyright 2013 Stephen Vickers
var snmp = require ("net-snmp");
    Monitor = require("../models/monitor.js");
    Sensor = require("../models/sensor")

/*
sessionInfo = {
    var targetIP = "161.246.6.96",
    var community = "read", // read(read data) or write(set data)
}

*/
function MonitorObj (username, password, sessionInfo) {
    this.sessionInfo = sessionInfo;
    this.username = username;
    this.password = password;
}

MonitorObj.prototype.getElementsTable = function(maxRepetitions, callback){
    // maxRepetitions parameter specifies how many OIDs lexicographically
    // following an OID for which varbinds should be fetched, and defaults to 20

    //1.3.6.1.4.1.39052.1.3 = ctlUnitElementsTable's OID in vutlan.mib
    var session = snmp.createSession (this.sessionInfo.targetIP, this.sessionInfo.community, {version: snmp.Version2c});
    session.table ("1.3.6.1.4.1.39052.1.3", maxRepetitions, function(err, table){
        var monitor;
        if (err) {
            if(typeof callback === 'function'){
                session.close();
    		    callback(err, null);
            }
    	} else {
            // console.log(table);
            try{
                var sensors =  [];
                var indexes = [];
                
                for (index in table) indexes.push(index);//search for index's name

                for (var i=indexes.length-1; i>=0; i--) {
                    // console.log(i);
                    if(i==0){ //1st row is monitor information
                        // console.log(table[indexes[i]]);
                        monitor = new Monitor(getSessionIP(this.sessionInfo), table[indexes[i]][7], new Date(), sensors);
                    }else{
                        sensors.push(new Sensor(table[indexes[i]]));
                    }
                }
                if(typeof callback === 'function'){
                    session.close();
                    callback(null, monitor);
                }
            }catch(err){
                session.close();
                throw new Error('Operation inside table function failed');
            }
    	}
    });
}


MonitorObj.prototype.setSensorById = function(setData, callback){
    var session = snmp.createSession (this.sessionInfo.targetIP, this.sessionInfo.community, {version: snmp.Version2c});
    var setting = {
        sid : setData.sid,
        sclass : setData.class,
        setName : setData.set.name,
        setLowAlarm : setData.set.lowAlarm,
        setLowWarning : setData.set.lowWarning,
        setHighWarning : setData.set.highWarning,
        setHighAlarm : setData.set.highAlarm,
        setExp : setData.set.exp,
        setAt0 : setData.set.at0,
        setAt75 : setData.set.at75,
        setReset : setData.set.reset,
        setLevel : setData.set.level,
        setReverse : setData.set.reverse,
        setInitState : setData.set.initial,
        setPulse : setData.set.pulse
    }
    var changeList = [];
    var done = 0;
    // console.log(setting);
    setName(session, setting.sid, setting.setName, function(err,res){
        if(!err) changeList.push(res);
    });
    if(setting.sclass === "analog"){
        if(setting.setLowAlarm != null){
            setInternalLowAlarm(session, setting.sid, setting.setLowAlarm, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANLowAlarm(session, setting.sid, setting.setLowAlarm, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSLowAlarm(session, setting.sid, setting.setLowAlarm, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setLowWarning != null){
            setInternalLowWarning(session, setting.sid, setting.setLowWarning, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANLowWarning(session, setting.sid, setting.setLowWarning, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSLowWarning(session, setting.sid, setting.setLowWarning, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setHighWarning != null){
            setInternalHighWarning(session, setting.sid, setting.setHighWarning, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANHighWarning(session, setting.sid, setting.setHighWarning, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSHighWarning(session, setting.sid, setting.setHighWarning, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setHighAlarm != null){
            setInternalHighAlarm(session, setting.sid, setting.setHighAlarm, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANHighAlarm(session, setting.sid, setting.setHighAlarm, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSHighAlarm(session, setting.sid, setting.setHighAlarm, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setAt0 != null){
            setInternalAt0(session, setting.sid, setting.setAt0, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANAt0(session, setting.sid, setting.setAt0, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSAt0(session, setting.sid, setting.setAt0, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setAt75 != null){
            setInternalAt75(session, setting.sid, setting.setAt75, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANAt75(session, setting.sid, setting.setAt75, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSAt75(session, setting.sid, setting.setAt75, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        // if(setting.setLowAlarm != null){
        //     setInternalExpression();
        //     setCANExpression();
        //     setRSExpression();
        // }
    }
    if(setting.sclass === "discrete"){
        if(setting.setReset != null){
            setAnalogReset(session, setting.sid, setting.setReset, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANReset(session, setting.sid, setting.setReset, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSReset(session, setting.sid, setting.setReset, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setLevel != null){
            setAnalogLevel(session, setting.sid, setting.setLevel, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANLevel(session, setting.sid, setting.setLevel, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSLevel(session, setting.sid, setting.setLevel, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setReverse != null){
            setAnalogReverse(session, setting.sid, setting.setReverse, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANReverse(session, setting.sid, setting.setReverse, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSReverse(session, setting.sid, setting.setReverse, function(err,res){
                if(!err) changeList.push(res);
            });
        }
    }
    if(setting.sclass === "switch"){
        if(setting.setInitState != null){
            setInternalInitial(session, setting.sid, setting.setInitState, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANInitial(session, setting.sid, setting.setInitState, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSInitial(session, setting.sid, setting.setInitState, function(err,res){
                if(!err) changeList.push(res);
            });
        }
        if(setting.setPulse != null){
            setInternalPulse(session, setting.sid, setting.setPulse, function(err,res){
                if(!err) changeList.push(res);
            });
            setCANPulse(session, setting.sid, setting.setPulse, function(err,res){
                if(!err) changeList.push(res);
            });
            setRSPulse(session, setting.sid, setting.setPulse, function(err,res){
                if(!err) changeList.push(res);
            });
        }
    }
    setTimeout(function(){ // because it asynchronus we must wait it for sometime to complete it's task.
        session.close();
        callback(null, changeList);
    }, 5000);
}

/*
sessionInfo = {
    var targetIP = "161.246.6.96",
    var community = "read", // read(read data) or write(set data)
}

*/


/*============================== Internal functions ==========================*/
function getSessionIP(ssInfo){
    return sessionInfo.targetIP;
}

function setName(ss, id, name, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.1.3.1.7." + id,
    	type: snmp.ObjectType.OctetString,
    	value: name
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Name: " + varbinds[0].value + "\"}");
    });
}
        /* ================Internal Analog ================== */
function setInternalLowAlarm(ss, id, la, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.10." + id,
    	type: snmp.ObjectType.OctetString,
    	value: la
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change LowAlarm: " + varbinds[0].value + "\"}");
    });
}

function setInternalLowWarning(ss, id, lw, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.11." + id,
    	type: snmp.ObjectType.OctetString,
    	value: lw
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change LowWarning: " + varbinds[0].value + "\"}");
    });
}

function setInternalHighWarning(ss, id, hw, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.12." + id,
    	type: snmp.ObjectType.OctetString,
    	value: hw
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change HighWarning: " + varbinds[0].value + "\"}");
    });
}

function setInternalHighAlarm(ss, id, ha, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.13." + id,
    	type: snmp.ObjectType.OctetString,
    	value: ha
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change HighAlarm: " + varbinds[0].value + "\"}");
    });
}

function setInternalAt0(ss, id, at0, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.14." + id,
    	type: snmp.ObjectType.OctetString,
    	value: at0
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change At0: " + varbinds[0].value + "\"}");
    });
}

function setInternalAt75(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.15." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change At75: " + varbinds[0].value + "\"}");
    });
}

function setInternalExpression(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.2.1.16." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Expression: " + varbinds[0].value + "\"}");
    });
}
            /* ================ CAN Analog ================= */
function setCANLowAlarm(ss, id, la, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.10." + id,
    	type: snmp.ObjectType.OctetString,
    	value: la
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change LowAlarm: " + varbinds[0].value + "\"}");
    });
}

function setCANLowWarning(ss, id, lw, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.11." + id,
    	type: snmp.ObjectType.OctetString,
    	value: lw
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change LowWarning: " + varbinds[0].value + "\"}");
    });
}

function setCANHighWarning(ss, id, hw, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.12." + id,
    	type: snmp.ObjectType.OctetString,
    	value: hw
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change HighWarning: " + varbinds[0].value + "\"}");
    });
}

function setCANHighAlarm(ss, id, ha, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.13." + id,
    	type: snmp.ObjectType.OctetString,
    	value: ha
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change HighAlarm: " + varbinds[0].value + "\"}");
    });
}

function setCANAt0(ss, id, at0, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.14." + id,
    	type: snmp.ObjectType.OctetString,
    	value: at0
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change At0: " + varbinds[0].value + "\"}");
    });
}

function setCANAt75(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.15." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change At75: " + varbinds[0].value + "\"}");
    });
}

function setCANExpression(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.2.1.16." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Expression: " + varbinds[0].value + "\"}");
    });
}
            /* ================ RS Analog ================= */
function setRSLowAlarm(ss, id, la, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.10." + id,
    	type: snmp.ObjectType.OctetString,
    	value: la
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change LowAlarm: " + varbinds[0].value + "\"}");
    });
}

function setRSLowWarning(ss, id, lw, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.11." + id,
    	type: snmp.ObjectType.OctetString,
    	value: lw
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change LowWarning: " + varbinds[0].value + "\"}");
    });
}

function setRSHighWarning(ss, id, hw, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.12." + id,
    	type: snmp.ObjectType.OctetString,
    	value: hw
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change HighWarning: " + varbinds[0].value + "\"}");
    });
}

function setRSHighAlarm(ss, id, ha, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.13." + id,
    	type: snmp.ObjectType.OctetString,
    	value: ha
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change HighAlarm: " + varbinds[0].value + "\"}");
    });
}

function setRSAt0(ss, id, at0, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.14." + id,
    	type: snmp.ObjectType.OctetString,
    	value: at0
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change At0: " + varbinds[0].value + "\"}");
    });
}

function setRSAt75(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.15." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change At75: " + varbinds[0].value + "\"}");
    });
}

function setRSExpression(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.2.1.16." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Expression: " + varbinds[0].value + "\"}");
    });
}

/* ============================ Internal Discrete ============================= */

function setAnalogReset(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.1.1.8." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Reset: " + varbinds[0].value + "\"}");
    });
}

function setAnalogLevel(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.1.1.9." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Level: " + varbinds[0].value + "\"}");
    });
}

function setAnalogReverse(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.1.1.10." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Reverse: " + varbinds[0].value + "\"}");
    });
}

/* ============================ CAN Discrete ================================ */

function setCANReset(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.1.1.8." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Reset: " + varbinds[0].value + "\"}");
    });
}

function setCANLevel(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.1.1.9." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Level: " + varbinds[0].value + "\"}");
    });
}

function setCANReverse(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.1.1.10." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        // console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change reverse: " + varbinds[0].value + "\"}");
    });
}

/* ============================ RS Discrete ================================ */

function setRSReset(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.1.1.8." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Reset: " + varbinds[0].value + "\"}");
    });
}

function setRSLevel(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.1.1.9." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change Level: " + varbinds[0].value + "\"}");
    });
}

function setRSReverse(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.1.1.10." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change reverse: " + varbinds[0].value + "\"}");
    });
}

/* ============================ Internal Outlet ============================= */

function setInternalInitial(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.3.1.8." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change initial: " + varbinds[0].value + "\"}");
    });
}

function setInternalPulse(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.5.3.1.9." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change pulse: " + varbinds[0].value + "\"}");
    });
}

/* ============================ CAN Outlet ============================= */

function setCANInitial(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.3.1.8." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change initial: " + varbinds[0].value + "\"}");
    });
}

function setCANPulse(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.6.3.1.9." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change pulse: " + varbinds[0].value + "\"}");
    });
}

/* ============================ RS Outlet ============================= */

function setRSInitial(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.3.1.8." + id,
    	type: snmp.ObjectType.OctetString,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change initial: " + varbinds[0].value + "\"}");
    });
}

function setRSPulse(ss, id, value, callback){
    var varbinds = [{
    	oid: "1.3.6.1.4.1.39052.7.3.1.9." + id,
    	type: snmp.ObjectType.Integer,
    	value: value
    }];
    // console.log(varbinds);
    ss.set (varbinds, function (error, varbinds) {
        //console.log(varbinds);
    	if (error) callback(error.toString ());
    	else callback(null, "{\"log\" : \"" + id + " change pulse: " + varbinds[0].value + "\"}");
    });
}

/* ================================ Exports ================================ */
exports.MonitorObj = MonitorObj;

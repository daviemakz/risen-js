'use strict';

// This file contains all the core functions which allow the eXchange server to
// do its work...

// Load Modules
var Notification = require('./../../open-daemon/core/util/logging.js');
var Network = require('./clients/common.js');
var Settings = require('./util/config.js');

// Load Templates
var CommandBodyObject = require('./template/command.js');
var ResponseBodyObject = require('./template/response.js');

// Invoke Configuration
var Configuration = new Settings();

// Load Configuration Settings
var MicroServerConnAttempts =
  Configuration.ServerCore.Settings.Connection.MicroAttempts;

// Invoke Server Objects
var DaemonMConnection = {
  Socket: '',
  Status: 0,
};
var DataMConnection = {
  Socket: '',
  Status: 0,
};
var NetworkMConnection = {
  Socket: '',
  Status: 0,
};
var OutreachMConnection = {
  Socket: '',
  Status: 0,
};
var SocialMConnection = {
  Socket: '',
  Status: 0,
};

//////////////// INVOKE SERVER CONNECTIONS /////////////////

// [Daemon] Micro Server
var StartMDaemon = function() {
  // Attempt Connection
  Network.InitiateMicroServerConnection(
    Configuration.ServerCore.Settings.XDaemon.PortListen,
    function(ConObject) {
      // Show Status
      if (ConObject.hasOwnProperty('error')) {
        console.log(
          'ERROR: Unable To Connect To Micro Server [Daemon]. Retrying...'
        );
        DaemonMConnection.Status = 0;
        StartMDaemon();
      } else {
        console.log(
          'NOTICE: Connected To Micro Server [Daemon]. Ready For Client Connections!'
        );
        DaemonMConnection.Status = 1;
      }
      // Store Socket Object
      DaemonMConnection.Socket = ConObject;
    }
  );
};

// [Data] Micro Server
var StartMData = function() {
  // Attempt Connection
  Network.InitiateMicroServerConnection(
    Configuration.ServerCore.Settings.XData.PortListen,
    function(ConObject) {
      // Show Status
      if (ConObject.hasOwnProperty('error')) {
        console.log(
          'ERROR: Unable To Connect To Micro Server [Data]. Retrying...'
        );
        DataMConnection.Status = 0;
        StartMData();
      } else {
        console.log(
          'NOTICE: Connected To Micro Server [Data]. Ready For Client Connections!'
        );
        DataMConnection.Status = 1;
      }
      // Store Socket Object
      DataMConnection.Socket = ConObject;
    }
  );
};

// [Network] Micro Server
var StartMNetwork = function() {
  // Attempt Connection
  Network.InitiateMicroServerConnection(
    Configuration.ServerCore.Settings.XNetwork.PortListen,
    function(ConObject) {
      // Show Status
      if (ConObject.hasOwnProperty('error')) {
        console.log(
          'ERROR: Unable To Connect To Micro Server [Network]. Retrying...'
        );
        NetworkMConnection.Status = 0;
        StartMNetwork();
      } else {
        console.log(
          'NOTICE: Connected To Micro Server [Network]. Ready For Client Connections!'
        );
        NetworkMConnection.Status = 1;
      }
      // Store Socket Object
      NetworkMConnection.Socket = ConObject;
    }
  );
};

// [Outreach] Micro Server
var StartMOutreach = function() {
  // Attempt Connection
  Network.InitiateMicroServerConnection(
    Configuration.ServerCore.Settings.XOutreach.PortListen,
    function(ConObject) {
      // Show Status
      if (ConObject.hasOwnProperty('error')) {
        console.log(
          'ERROR: Unable To Connect To Micro Server [Outreach]. Retrying...'
        );
        OutreachMConnection.Status = 0;
        StartMOutreach();
      } else {
        console.log(
          'NOTICE: Connected To Micro Server [Outreach]. Ready For Client Connections!'
        );
        OutreachMConnection.Status = 1;
      }
      // Store Socket Object
      OutreachMConnection.Socket = ConObject;
    }
  );
};

// [Social] Micro Server
var StartMSocial = function() {
  // Attempt Connection
  Network.InitiateMicroServerConnection(
    Configuration.ServerCore.Settings.XSocial.PortListen,
    function(ConObject) {
      // Show Status
      if (ConObject.hasOwnProperty('error')) {
        console.log(
          'ERROR: Unable To Connect To Micro Server [Social]. Retrying...'
        );
        SocialMConnection.Status = 0;
        StartMSocial();
      } else {
        console.log(
          'NOTICE: Connected To Micro Server [Social]. Ready For Client Connections!'
        );
        SocialMConnection.Status = 1;
      }
      // Store Socket Object
      SocialMConnection.Socket = ConObject;
    }
  );
};

//////////////// INITIALIZE MICRO SERVER /////////////////

// Initialize Connection [Daemon]
StartMDaemon();

// Initialize Connection [Data]
StartMData();

// Initialize Connection [Network]
StartMNetwork();

// Initialize Connection [Outreach]
StartMOutreach();

// Initialize Connection [Social]
StartMSocial();

/////////////////////////////////////////////////////////////

// FUNCTION : Handles Error(s) In Communication/Messages
function ProcessComError(data, message, id) {
  // Invoke Template(s)
  var ResObject = new ResponseBodyObject();
  var ComObject = new CommandBodyObject();

  // Get Parameters
  var CData = data;
  var ConId = id;
  var CMessage = message;

  // Check Empty Data
  if (!CData) {
    // Create Response Object
    var ResponseObject = ResObject;

    ////////////////
    // Build Response Object [Status - Transport]
    ResponseObject.Status.Transport = {
      Code: 2001,
      Message: 'No Data Recieved',
    };
    // Build Response Object [Status - Transport]
    ResponseObject.Status.Command = {
      Code: 200,
      Message: 'Command Not Executed - Transport Failiure / No Data Recieved',
    };
    // Build Response Object [ResBody - Error Details]
    ResponseObject.ResultBody.ErrData = {
      Entity: 'Main eXChange Server',
      Action: 'Message Error Handling',
      EType: 'ERROR',
      OriginalData: CData,
    };
    ////////////////

    // Send Response
    CMessage.reply(ResponseObject);

    // Notification
    Notification.LogEvent(
      null,
      null,
      null,
      'Main eXChange Server',
      'Message Error Handling',
      'ERROR',
      'No Data Recieved. MORE INFO: ' + ResponseObject,
      null,
      true
    );
  }

  // Return
  return;
}

// FUNCTION : Process Communication Request
function ProcessComRequest(data, message, id) {
  // Invoke Template(s)
  var ResObject = new ResponseBodyObject();
  var ComObject = new CommandBodyObject();

  // Get Parameters
  var CData = data;
  var ConId = id;
  var CMessage = message;

  // Micro Server Connection Attempt Count...
  var ConnectionAttempts = 0;

  var CheckConnection = function(
    recDataC,
    foreignSocketC,
    localSocketC,
    ConId
  ) {
    // Perform Action
    var ReturnResult = MicroServerCommunication(
      recDataC,
      foreignSocketC,
      localSocketC
    );

    // Check Connection, Execute Or Timeout...
    if (ReturnResult == 20) {
      if (ConnectionAttempts > MicroServerConnAttempts) {
        // Notification
        Notification.LogEvent(
          null,
          null,
          null,
          'Main eXChange Server',
          'Initiating Micro Server Connection',
          'ERROR',
          'Micro Server Connection Initiation Attempts - Maximum Reached',
          null,
          true
        );

        // Create Response Object
        var ResponseObject = ResObject;

        /////////////////////////
        // Build Response Object [Status - Transport]
        ResponseObject.Status.Transport = {
          Code: 2002,
          Message:
            'Micro Server Connection Initiation Attempts - Maximum Reached',
        };
        // Build Response Object [Status - Transport]
        ResponseObject.Status.Command = {
          Code: 201,
          Message: 'Command Not Executed - Transport Failiure',
        };
        // Build Response Object [ResBody - Error Details]
        ResponseObject.ResultBody.ErrData = {
          Entity: 'Main eXChange Server',
          Action: 'Micro Server Redirection',
          EType: 'ERROR',
          OriginalData: CData,
        };
        /////////////////////////

        // Send Response Back To Source
        foreignSocketC.reply(ResponseObject);

        // Close Socket
        foreignSocketC.conn.destroy();

        // Return
        return;
      } else {
        // Increment Connection Attempts
        ConnectionAttempts++;

        // Wait & Try Again...
        setTimeout(function() {
          CheckConnection(recDataC, foreignSocketC, localSocketC, ConId);
        }, 10);
      }
    } else {
      // CL
      console.log(
        '[' + ConId + '] Local Socket Connection Handed Over Successfully!'
      );

      // Return
      return;
    }
  };

  // Process Request [Redirection]
  if (CData.MSGDest == 'D-DAEMON') {
    // Check Connection & Send Data
    CheckConnection(CData, CMessage, DaemonMConnection, ConId);
  } else if (CData.MSGDest == 'D-DATA') {
    // Check Connection & Send Data
    CheckConnection(CData, CMessage, DataMConnection, ConId);
  } else if (CData.MSGDest == 'D-NETWORK') {
    // Check Connection & Send Data
    CheckConnection(CData, CMessage, NetworkMConnection, ConId);
  } else if (CData.MSGDest == 'D-OUTREACH') {
    // Check Connection & Send Data
    CheckConnection(CData, CMessage, OutreachMConnection, ConId);
  } else if (CData.MSGDest == 'D-SOCIAL') {
    // Check Connection & Send Data
    CheckConnection(CData, CMessage, SocialMConnection, ConId);
  } else {
    // Notification
    Notification.LogEvent(
      null,
      null,
      null,
      'Main eXChange Server',
      'Micro Server Message Routing',
      'ERROR',
      'Request Recieved But Destination Unknown. MORE INFO: ' + CData.MSGDest,
      null,
      true
    );

    // Create Response Object
    var ResponseObject = ResObject;

    /////////////////////////
    // Build Response Object [Status - Transport]
    ResponseObject.Status.Transport = {
      Code: 2005,
      Message: 'Request Recieved But Destination Unknown',
    };
    // Build Response Object [Status - Transport]
    ResponseObject.Status.Command = {
      Code: 201,
      Message: 'Command Not Executed - Transport Failiure',
    };
    // Build Response Object [ResBody - Error Details]
    ResponseObject.ResultBody.ErrData = {
      Entity: 'Main eXChange Server',
      Action: 'Micro Server Redirection',
      EType: 'ERROR',
      OriginalData: CData,
    };
    /////////////////////////

    // Reply
    CMessage.reply(ResponseObject);

    // Close Socket
    CMessage.conn.destroy();
  }

  // Return
  return;
}

// FUNCTION: Communicate With MicroServer
function MicroServerCommunication(recData, foreignSocket, localSocket) {
  // Get Parameters
  var RecievedData = recData;
  var FSocket = foreignSocket;
  var LSocket = localSocket;

  // Check Socket Readiness...
  if (LSocket.Status == 0) {
    // Return Fail (Local Socket Not Ready)
    return 20;
  } else {
    // Send Message To Micro Server
    LSocket.Socket.request('MICRO_COM_REQUEST', RecievedData, function(dataR) {
      // Send Micro Service Response To Source
      FSocket.reply(dataR);
      // Close Socket If Keep Alive Not Set
      if (RecievedData.MSGKeepAlive === false) {
        FSocket.conn.destroy();
      }
      return 10;
    });
  }
}

// EXPORTS
module.exports.ProcessComRequest = ProcessComRequest;
module.exports.ProcessComError = ProcessComError;

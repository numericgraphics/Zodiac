angular.module('assets', [])
.factory('AssetManagementService', function () {
    var _localStore;
    var _remoteVenue;
    var _remoteEvent;
    var _remotePopup;
    var _remoteTemplate;
    var _remoteMisc;
    
    var tempLocalFile;
    var tempRemoteFile;
    var tempCallBack;
    
    var tempModel;
    var tempAssetIndex;
    var tempBaseEntry;
    
    function downloadFile(error) {
        var fileTransfer = new FileTransfer();
        
        fileTransfer.download(tempRemoteFile, tempLocalFile, 
            function (entry) {
            tempCallBack(null, entry);
            voidTempVars();
        },
            function (err) {
            tempCallBack(err, null);
            voidTempVars();
        }
        );
    }
    
    function onResolveFile(fileEntry) {
        tempCallBack(null, fileEntry);
        voidTempVars();
    }
    
    function downloadTemplate(error) {
        var fileTransfer = new FileTransfer();
        
        fileTransfer.download(tempRemoteFile, tempLocalFile, 
            function (entry) {
            tempBaseEntry = entry;
            if (tempModel.assets.length > 0) {
                tempAssetIndex = 0;
                checkModelAssets();
            } else {
                tempCallBack(null, tempBaseEntry);
                voidTempVars();
            }
        },
            function (err) {
            tempCallBack(err, null);
            voidTempVars();
        }
        );
    }
    function onResolveTemplate(fileEntry) {
        tempBaseEntry = fileEntry;
        if (tempModel.assets.length > 0) {
            tempAssetIndex = 0;
            checkModelAssets();
        } else {
            tempCallBack(null, tempBaseEntry);
            voidTempVars();
        }
    }
    
    function downloadAsset(error) {
        var fileTransfer = new FileTransfer();
        
        fileTransfer.download(tempRemoteFile, tempLocalFile, 
            function (entry) {
            tempAssetIndex++;
            checkModelAssets();
        },
            function (err) {
            tempAssetIndex++;
            checkModelAssets();
        }
        );
    }
    function onResolveAsset(obj) {
        tempAssetIndex++;
        checkModelAssets();
    }
    
    function checkModelAssets() {
        if (tempAssetIndex < tempModel.assets.length) {
            tempLocalFile = _localStore + 'templates/' + tempModel.name + '/assets/' + tempModel.assets[tempAssetIndex];
            tempRemoteFile = encodeURI(_remoteTemplate + tempModel.name + '/assets/' + tempModel.assets[tempAssetIndex]);
            
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveAsset, downloadAsset);
        } else {
            tempCallBack(null, tempBaseEntry);
            voidTempVars();
        }
    }
    
    function fillTempVars(loc, rem, cb) {
        tempLocalFile = loc;
        tempRemoteFile = encodeURI(rem);
        tempCallBack = cb;
    }
    
    function voidTempVars() {
        tempBaseEntry = null;
        tempModel = null;
        tempAssetIndex = null;
        tempLocalFile = null;
        tempRemoteFile = null;
        tempCallBack = null;
    }
    
    return {
        templateDirectory : function () {
            return cordova.file.dataDirectory + 'templates/';
        },
        initialize : function () {
            _localStore = cordova.file.dataDirectory;
            _remoteVenue = 'http://www.thesummits.eu/img/upload/venue/';
            _remoteEvent = 'http://www.thesummits.eu/img/upload/event/';
            _remoteNews = 'http://www.thesummits.eu/img/upload/news/';
            _remotePopup = 'http://www.thesummits.eu/shared/promo/';
            _remoteTemplate = 'http://www.thesummits.eu/shared/templates/';
            _remoteMisc = 'http://www.thesummits.eu/shared/miscelaneous/';
        },
        getVenueImage : function (fileName, callback) {
            fillTempVars(_localStore + 'venue_' + fileName, _remoteVenue + fileName, callback);
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveFile, downloadFile);
        },
        getNewsImage : function (fileName, callback) {
            fillTempVars(_localStore + 'news_' + fileName, _remoteNews + fileName, callback);
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveFile, downloadFile);
        },
        getEventImage : function (fileName, callback) {
            fillTempVars(_localStore + 'event_' + fileName, _remoteVenue + fileName, callback);
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveFile, downloadFile);
        },
        getTemplate : function (template, callback) {
            fillTempVars(_localStore + 'templates/' + template.name + '/' + template.file, _remoteTemplate + template.name + '/' + template.file, callback);
            tempModel = template;
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveTemplate, downloadTemplate);
        },
        getFile : function (fileURL, callback) {
            fillTempVars(_localStore + 'miscelaneous/' + fileURL, _remoteMisc + fileURL, callback);
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveFile, downloadFile);
        },
        getAdvertImage : function (fileName, callback) {
            fillTempVars(_localStore + 'popups/' + fileName, _remotePopup + fileName, callback);
            window.resolveLocalFileSystemURL(tempLocalFile, onResolveFile, downloadFile);
        }
    }
});
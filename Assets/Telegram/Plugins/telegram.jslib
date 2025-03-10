mergeInto(LibraryManager.library, {

	IsTelegramWebApp: function () {
		return window.isTelegramWebApp();
	},

    GetInitData: function () {
        let dataString = null;
        if (window.Telegram && window.Telegram.WebApp) {
            dataString = window.Telegram.WebApp.initData;
        }

        if (!dataString) {
            return null;
        }

        const bufferSize = lengthBytesUTF8(dataString) + 1;
        const buffer = _malloc(bufferSize);
        stringToUTF8(dataString, buffer, bufferSize);
        return buffer;
    },

    OpenLink: function (url) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(UTF8ToString(url));
        } else {
            window.open(url, '_blank');
        }
    },

    OpenTelegramLink: function (url) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openTelegramLink(UTF8ToString(url));
        } else {
            window.open(url, '_blank');
        }
    },

    OpenInvoice: function (url, callback) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openInvoice(UTF8ToString(url), function (status)
            {
                const bufferSize = lengthBytesUTF8(status) + 1;
                const buffer = _malloc(bufferSize);
                stringToUTF8(status, buffer, bufferSize);

                {{{ makeDynCall('vi', 'callback') }}}(buffer);
                _free(buffer);
            });
        }
    },

    ConnectTonWallet: function(onStatus) {
        window.tonConnectToWallet(function (status, data) {
            const bufferSize = lengthBytesUTF8(data) + 1;
            const buffer = _malloc(bufferSize);
            stringToUTF8(data, buffer, bufferSize);

            {{{ makeDynCall('vii', 'onStatus') }}}(status, buffer);
            _free(buffer);
        });
    },
    
    DisconnectTonWallet: function() {
        window.tonDisconnectWallet();
    },
    
    WebAppStateUpdated: function(onActivated, onDeactivated) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.onEvent("activated", function(event)
            {
              {{{ makeDynCall('v', 'onActivated') }}}();
            });
			
			window.Telegram.WebApp.onEvent("deactivated", function(event)
            {
              {{{ makeDynCall('v', 'onDeactivated') }}}();
            });
        }
    },

    CloseGame: function() {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        }
    },
    
    GetWriteConsent: function() {
        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.requestWriteAccess();
        }
    },
    
    ReadFromClipboard: function(onResult) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.readTextFromClipboard((event) => {
                const clipText = event.data;
                const lengthBytes = lengthBytesUTF8(clipText) + 1;
                const resultOnHeap = _malloc(lengthBytes);
                stringToUTF8(clipText, resultOnHeap, lengthBytes);
                {{{ makeDynCall('vi', 'onResult') }}}(resultOnHeap);
                _free(resultOnHeap);
            });
        }
   }
});
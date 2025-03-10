using System;
using UnityEngine;

#if UNITY_WEBGL && !UNITY_EDITOR
using System.Runtime.InteropServices;
using AOT;
#endif

namespace Telegram.Runtime
{
    public static class TelegramWebApp
    {
        private static Action<bool, string> _walletCallback;

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        public static extern bool IsTelegramWebApp();

        [DllImport("__Internal")]
        public static extern string GetInitData();

        [DllImport("__Internal")]
        public static extern void ConnectTonWallet(Action<int, string> onStatus);

        [DllImport("__Internal")]
        public static extern void DisconnectTonWallet();

        [DllImport("__Internal")]
        public static extern void CloseGame();

        [MonoPInvokeCallback(typeof(Action<int, string>))]
        private static void OnConnectStatus(int status, string data)
        {
            _walletCallback?.Invoke(status == 0, data);
            _walletCallback = null;
        }

        public static void ConnectTonWallet(Action<bool, string> callback)
        {
            _walletCallback = callback;
            ConnectTonWallet(OnConnectStatus);
        }
#else
        public static string GetInitData()
        {
            return string.Empty;
        }

        public static bool IsTelegramWebApp()
        {
            return false;
        }

        public static void ConnectTonWallet(Action<bool, string> callback)
        {
            callback?.Invoke(false, "Not implemented");
        }

        public static void DisconnectTonWallet()
        {
            Debug.Log($"{nameof(TelegramWebApp)} | DisconnectTonWallet not implemented");
        }

        public static void CloseGame()
        {
            Debug.Log($"{nameof(TelegramWebApp)} | CloseGame not implemented");
        }


#endif
    }
}

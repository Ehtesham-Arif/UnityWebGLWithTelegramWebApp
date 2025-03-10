using UnityEngine;

namespace Telegram.Runtime
{
    public sealed class TelegramInfoPresenter : MonoBehaviour
    {
        private void Start()
        {
            Debug.Log("TelegramWebApp.IsTelegramWebApp(): " + TelegramWebApp.IsTelegramWebApp());
            Debug.Log("TelegramWebApp.GetInitData(): " + TelegramWebApp.GetInitData());
        }
    }
}

using System;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using MessageList.Models.Helpers;
using MessageList.Models.QueryModels;
using MessageList.Models.Extensions;

namespace MessageList.Models.Validators
{
    public static class Validator
    {
        private static readonly string _notOnlySpaceBar = @"\S";
        private static bool _validateString(string pattern, string stringToValidate, int minLength, int maxLength)
        {
            bool result = false;
            if (!String.IsNullOrEmpty(stringToValidate))
            {
                result = Regex.IsMatch(stringToValidate, pattern) && stringToValidate.Length >= minLength && stringToValidate.Length <= maxLength;
            }
            return result;
        }

        public static bool IsEmailValid(string email) => _validateString(@"^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$", email, 1, 300);

        public static bool IsPasswordValid(string password) => _validateString(@"^.{4,20}$", password, 4, 20) && Regex.IsMatch(password, _notOnlySpaceBar);

        public static bool IsMessagesToLoadAmountValid(int amount) => (amount >= FileHelper.MessagesToLoadAmountMin && amount <= FileHelper.MessagesToLoadAmountMax) || (amount == 0);

        public static bool IsChangePasswordKeyValid(string key) => !String.IsNullOrEmpty(key) ? key.Length >= 1 && key.Length <= 30 : false;
        public static bool IsMessageGroupNameValid(string name) => name.Length >= 1 && name.Length <= 20 && Regex.IsMatch(name, _notOnlySpaceBar);

        public static void ValidateUserInfo(QueryUserInfo userInfo, User user)
        {
            if (IsEmailValid(userInfo.Email))
            {
                user.Email = userInfo.Email;
            }
            else
            {
                throw new ArgumentException("Неправильный формат email");
            }
            if (IsMessagesToLoadAmountValid(userInfo.MessagesToLoadAmount))
            {
                user.MessagesToLoadAmount = userInfo.MessagesToLoadAmount;
            }
            else
            {
                throw new ArgumentException("Слишком малое кол-во загружаемых сообщений");
            }
            if (IsChangePasswordKeyValid(userInfo.ChangePasswordKey))
            {
                user.Key = userInfo.ChangePasswordKey;
            }
            else if (!String.IsNullOrEmpty(userInfo.ChangePasswordKey) && userInfo.ChangePasswordKey.Length > 30)
            {
                throw new ArgumentException("Неправильный формат ключа смены пароля");
            }
        }

        public static void ValidateUserPassword(string password, User user)
        {
            if (IsPasswordValid(password))
            {
                user.Password = password.GetCustomAlgoHashCode(SHA256.Create());
            }
            else
            {
                throw new ArgumentException("Неправильный формат пароля");
            }
        }
    }
}

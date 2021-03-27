using System;
using Xunit;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;

namespace MessageList.ModelsTests.Validators.Tests
{
    public class ValidatorTests
    {
        [Fact]
        public void ItShould_return_true_if_email_is_valid()
        {
            string email = "qwerty@qwerty.ru";
            bool actual = Validator.IsEmailValid(email);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_email_is_empty()
        {
            string email = String.Empty;
            bool actual = Validator.IsEmailValid(email);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_email_is_too_long()
        {
            string email = String.Join(",", new string[200]);
            bool actual = Validator.IsEmailValid(email);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_email_is_too_short()
        {
            string email = "q";
            bool actual = Validator.IsEmailValid(email);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_email_has_no_high_level_domain()
        {
            string email = "qwerty@qwerty";
            bool actual = Validator.IsEmailValid(email);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_email_has_no_domain()
        {
            string email = "qwerty.ru";
            bool actual = Validator.IsEmailValid(email);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_email_has_no_domains_at_all()
        {
            string email = "qwerty";
            bool actual = Validator.IsEmailValid(email);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_true_if_password_is_valid()
        {
            string password = "qwerty";
            bool actual = Validator.IsPasswordValid(password);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_password_is_an_empty_string()
        {
            string password = String.Empty;
            bool actual = Validator.IsPasswordValid(password);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_password_consists_only_of_spacebars()
        {
            string password = "        ";
            bool actual = Validator.IsPasswordValid(password);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_password_is_too_short()
        {
            string password = "shh";
            bool actual = Validator.IsPasswordValid(password);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_password_is_too_long()
        {
            string password = "tooooolooooongstriiiing";
            bool actual = Validator.IsPasswordValid(password);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_true_if_amount_of_messages_is_valid()
        {
            int amount = 25;
            bool actual = Validator.IsMessagesToLoadAmountValid(amount);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_true_if_amount_of_messages_is_zero()
        {
            int amount = 0;
            bool actual = Validator.IsMessagesToLoadAmountValid(amount);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_amount_of_messages_is_too_small()
        {
            int amount = 10;
            bool actual = Validator.IsMessagesToLoadAmountValid(amount);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_amount_of_messages_is_too_big()
        {
            int amount = 1000000001;
            bool actual = Validator.IsMessagesToLoadAmountValid(amount);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_true_if_change_password_key_is_valid()
        {
            string key = "somekey";
            bool actual = Validator.IsChangePasswordKeyValid(key);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_change_password_key_is_null()
        {
            string key = null;
            bool actual = Validator.IsChangePasswordKeyValid(key);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_change_password_key_is_empty()
        {
            string key = String.Empty;
            bool actual = Validator.IsChangePasswordKeyValid(key);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_change_password_key_is_too_long()
        {
            string key = "some very very long long string string string";
            bool actual = Validator.IsChangePasswordKeyValid(key);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_true_if_group_name_is_valid()
        {
            string groupName = "some group name";
            bool actual = Validator.IsMessageGroupNameValid(groupName);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_group_name_is_null()
        {
            string groupName = null;
            bool actual = Validator.IsMessageGroupNameValid(groupName);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_group_name_is_empty()
        {
            string groupName = String.Empty;
            bool actual = Validator.IsMessageGroupNameValid(groupName);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_group_name_is_spacebars()
        {
            string groupName = "     ";
            bool actual = Validator.IsMessageGroupNameValid(groupName);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_group_name_is_too_long()
        {
            string groupName = "some very very long group name";
            bool actual = Validator.IsMessageGroupNameValid(groupName);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_true_if_message_text_is_valid()
        {
            string messageText = "some message text. Not so long but also not so short";
            bool actual = Validator.IsMessageTextValid(messageText);

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_message_text_is_null()
        {
            string messageText = null;
            bool actual = Validator.IsMessageTextValid(messageText);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_message_text_is_empty()
        {
            string messageText = String.Empty;
            bool actual = Validator.IsMessageTextValid(messageText);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_message_text_is_spacebars()
        {
            string messageText = "     ";
            bool actual = Validator.IsMessageTextValid(messageText);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_message_text_is_too_long()
        {
            string messageText = String.Join(",", new string[6000]);
            bool actual = Validator.IsMessageTextValid(messageText);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_true_if_feedback_has_text_and_contacts()
        {
            bool actual = Validator.IsFeedbackValid("some feedback text", "some feedback contacts");

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_true_if_feedback_has_text_but_no_contacts()
        {
            bool actual = Validator.IsFeedbackValid("some feedback text", "");

            Assert.True(actual);
        }

        [Fact]
        public void ItShould_return_false_if_feedback_text_is_null()
        {
            bool actual = Validator.IsFeedbackValid(null, "some feedback contacts");

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_feedback_text_is_empty()
        {
            bool actual = Validator.IsFeedbackValid("", "some feedback contacts");

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_feedback_text_is_too_long()
        {
            string longText = String.Join(",",new string[5000]);
            bool actual = Validator.IsFeedbackValid(longText, "some feedback contacts");

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_return_false_if_feedback_contacts_are_too_long()
        {
            string longContacts = String.Join(",", new string[500]);
            bool actual = Validator.IsFeedbackValid("some feedback text", longContacts);

            Assert.False(actual);
        }

        [Fact]
        public void ItShould_throw_exception_if_email_in_userInfo_is_invalid()
        {
            QueryUserInfo userInfo = new QueryUserInfo("invalid@email", "password");
            User user = new User();

            Assert.Throws<ArgumentException>(() => Validator.ValidateUserInfo(userInfo, user));
        }

        [Fact]
        public void ItShould_throw_exception_if_messages_amount_in_userInfo_is_invalid()
        {
            QueryUserInfo userInfo = new QueryUserInfo("email@email.ru", "password");
            userInfo.MessagesToLoadAmount = 11;
            User user = new User();

            Assert.Throws<ArgumentException>(() => Validator.ValidateUserInfo(userInfo, user));
        }

        [Fact]
        public void ItShould_throw_exception_if_password_key_in_userInfo_is_invalid()
        {
            QueryUserInfo userInfo = new QueryUserInfo("email@email.ru", "password");
            userInfo.ChangePasswordKey = "change change password password key key";
            User user = new User();

            Assert.Throws<ArgumentException>(() => Validator.ValidateUserInfo(userInfo, user));
        }

        [Fact]
        public void ItShould_throw_exception_if_password_is_invalid()
        {
            string password = "sh";
            User user = new User();

            Assert.Throws<ArgumentException>(() => Validator.ValidateUserPassword(password, user));
        }
    }
}

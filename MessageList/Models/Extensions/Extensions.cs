using System;
using System.Security.Cryptography;
using System.Text;

namespace MessageList.Models.Extensions
{
    public static class Extensions
    {
        public static string GetCustomAlgoHashCode(this string str, HashAlgorithm hashAlgorithm)
        {
            using (hashAlgorithm)
            {
                byte[] hash = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(str));
                StringBuilder passwordHash = new StringBuilder(hash.Length);
                for (int i = 0; i < hash.Length; i++)
                {
                    passwordHash.Append(hash[i].ToString("x2"));
                }
                return passwordHash.ToString();
            }
        }
    }
}

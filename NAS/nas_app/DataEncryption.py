import base64


class DataEncrypt:
    # 传入一个二进制数据和一个key，根据这个key的ascll码对二进制数据进行替换并返回
    def __inversion_data(self, data, key):
        # 获取传入key的ascll码值
        key = "".join([str(ord(c)) for c in key]).replace("0", "")
        key_list = list(key)
        # 对key进行隔3取1
        for i, v in enumerate(key_list):
            if not i % 3:
                key_list.pop(i)
        key_list.reverse()
        key = "".join(key_list)

        # 对二进制文件以传入的key为依据进行1-0替换操作
        loop_counter = 0
        key_loop = 0
        encipher_data = ""
        for i in data:
            if i == " ":
                encipher_data += i
                continue
            if loop_counter == int(key[key_loop]):
                if i == "1":
                    i = "0"
                else:
                    i = "1"
                loop_counter = 0
                key_loop += 1
            loop_counter += 1
            if key_loop >= len(key):
                key_loop = 0
            encipher_data += i
        return encipher_data

    # 获取字符串的二进制数
    def __string_to_byte(self, data):
        data = ' '.join([bin(ord(c)).replace('0b', '').zfill(8) for c in data])
        return data

    # 获取二进制对应的字符串
    def __byte_to_string(self, byte):
        string = "".join([chr(i) for i in [int(b, 2) for b in byte.split(" ")]])
        return string

    # 对数据进行二进制key加密
    def __cipher(self, data, key):
        # 获取数据的二进制数
        data = self.__string_to_byte(data)
        encipher_byte = self.__inversion_data(data, key)
        encipher_data = self.__byte_to_string(encipher_byte)
        return encipher_data

    # 对数据先进行base64加密在进行二进制加密
    def encipher(self, data, key):
        data = str(data)
        key = str(key)
        # 使用base64加密
        data = base64.b64encode(data.encode(encoding='utf-8')).decode()
        # 使用二进制加密
        encipher_data = self.__cipher(data, key)
        # 使用base64再次加密
        encipher_data = base64.b64encode(encipher_data.encode(encoding='utf-8')).decode()
        return encipher_data

    # 对数据先进行二进制解密在进行base64解密
    def decipher(self, data, key):
        data = str(data)
        key = str(key)
        # 使用base64解密
        data = base64.b64decode(data).decode()
        # 使用二进制解密
        data = self.__cipher(data, key)
        # 使用base64二次解密
        decipher_data = base64.b64decode(data).decode()
        return decipher_data


class Encrypt(DataEncrypt):
    def __init__(self):
        super(Encrypt, self).__init__()

    def encipher(self, data, key):
        return super(Encrypt, self).encipher(data, key)

    def decipher(self, data, key):
        return super(Encrypt, self).decipher(data, key)


if __name__ == "__main__":
    password = "yangxu"
    key = "牛逼66661"
    print("需要加密的数据：", password)
    print("加密的密钥：", key)
    cip = Encrypt()
    e = cip.encipher(password, key)
    print("加密后的数据：", e)
    d = cip.decipher('RXouwozCtjvCrVQ=', 'yangxu19970325wangqiao')
    print("解密后的数据：", d)

    s = 'NMKKN8OsWsOiDXU='
    print(cip.decipher(s, 'yangxu'))








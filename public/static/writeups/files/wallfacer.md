## About the Challenge
This challenge involves retreiving a flag located somewhere within an andriod application. I will be using [Andriod Studio](https://developer.android.com) to load and debug the apk file. 

Entering the application, we are greeted with the following screen:
![Main Page](/static/writeups/photos/wallfacer1.png)

Entering text into the field and submitting doesn't give anything. It's likely some secret phrase is required to trigger an event to happen.

To investigate the code, we can use a tool like [jadx](https://github.com/skylot/jadx), which will allow us to decompile the code to readable java code.

The main programme code seems to be located in com/wall/facer

**MainActivity.java**
```java_RETRACT
public class MainActivity extends C0 {
    public EditText y;

    @Override // defpackage.C0, defpackage.O3, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_main);
        this.y = (EditText) findViewById(R.id.edit_text);
    }

    public void onSubmitClicked(View view) {
        Storage.getInstance().saveMessage(this.y.getText().toString());
    }
}
```
This MainAcitivty file seems to be running the page we see when we open the app. 

When the submit button is clicked, the text that we input seems to be saved to a storage object. 

Visiting the **Storage.java** file confirms that the Storage object simply stores the data is is fed.

**query.java**
```java
public class query extends C0 {
    public EditText y;
    public EditText z;

    @Override // defpackage.C0, defpackage.O3, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_query);
        this.y = (EditText) findViewById(R.id.key_text);
        this.z = (EditText) findViewById(R.id.iv_text);
    }

    public void onSubmitClicked(View view) {
        Context applicationContext = getApplicationContext();
        String obj = this.y.getText().toString();
        String obj2 = this.z.getText().toString();
        try {
            byte[] decode = Base64.decode(applicationContext.getString(R.string.str), 0);
            byte[] bytes = obj.getBytes();
            byte[] bytes2 = obj2.getBytes();
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(2, new SecretKeySpec(bytes, "AES"), new IvParameterSpec(bytes2));
            Log.d(getString(R.string.tag), "Decrypted data: ".concat(new String(cipher.doFinal(decode))));
        } catch (Exception unused) {
            Log.e(getString(R.string.tag), "Failed to decrypt data");
        }
    }
}
```

The above file is another interesting file that we can look into. It seems to take in a string, and attempts to decrypt it using the user inputted key and iv. We can take a look at the **strings.xml** file to figure out what the str in **R.string.str** is  
*`<string name="str">4tYKEbM6WqQcItBx0GMJvssyGHpVTJMhpjxHVLEZLVK6cmIH7jAmI/nwEJ1gUDo2</string>`*
This seems to be the payload we are trying to decrypt. The goal of the challenge seems to be to find the correct Key and IV to decrypt the flag.

Other than that, there does not seem to be much else code in the file, and nothing to do with the value we need to input into the text field to make the application work

## Dynamic Code Loading
The Challenge Description hints that certain parts of the application is loaded during runtime. This means that [Dynamic Code Loading](https://erev0s.com/blog/3-ways-for-dynamic-code-loading-in-android/) is likely being used in the application. The code could be **encrypted** in some way such that we could not read it, and is only decrypted and loaded when we launch the app.

To located where the code is being dynamically loaded, we can search through the files for a method named *`DexClassLoader`*
We find this line of code inside **K0.java**
```java
new InMemoryDexClassLoader(
    A8.K(context3, 
new String(Base64.decode(context3.getString(R.string.filename), 0))), 
context3.getClassLoader()).loadClass("DynamicClass").getMethod("dynamicMethod", Context.class).invoke(null, context3);
```
It seems this is calling the *`A8.K`* function on the file being stored at *`R.string.filename`*. The result is likely some a dex file, which is then loaded by the application. Looking at *`strings.xml`* again, we find that *`filename`* is *`c3FsaXRlLmRi`*, which decodes to *`sqlite.db`*. sqlite.db is likely the file that contains the encrypted code that is being loaded. It is located in the assets folder of the application.

## Retrieving the loaded code
To decrypt the code, we need to find out what this *`A8.K`* function is doing.
```java_RETRACT
    public static ByteBuffer K(Context context, String str) {
        int i2;
        InputStream open = context.getAssets().open(str);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] bArr = new byte[1024];
        while (true) {
            int read = open.read(bArr);
            if (read == -1) {
                break;
            }
            byteArrayOutputStream.write(bArr, 0, read);
        }
        open.close();
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        byte[] bArr2 = new byte[128];
        byte[] bArr3 = new byte[4];
        System.arraycopy(byteArray, 4096, bArr3, 0, 4);
        int i3 = ByteBuffer.wrap(bArr3).getInt();
        byte[] bArr4 = new byte[i3];
        System.arraycopy(byteArray, 4100, bArr4, 0, i3);
        System.arraycopy(byteArray, 4100 + i3, bArr2, 0, 128);
        C0289q1 c0289q1 = new C0289q1(bArr2);
        byte[] bArr5 = new byte[i3];
        int i4 = 0;
        int i5 = 0;
        for (i2 = 0; i2 < i3; i2++) {
            i4 = (i4 + 1) & 255;
            byte[] bArr6 = (byte[]) c0289q1.c;
            byte b2 = bArr6[i4];
            i5 = (i5 + (b2 & 255)) & 255;
            bArr6[i4] = bArr6[i5];
            bArr6[i5] = b2;
            bArr5[i2] = (byte) (bArr6[(bArr6[i4] + b2) & 255] ^ bArr4[i2]);
        }
        return ByteBuffer.wrap(bArr5);
    }
```
I won't explain in great detail what the code is doing. We simply need to run the code ourselves to get the decrypted dex file.

Afterwards, we can use jadx to decompile the dex file to get the source code. <br>
The following is the main function run in the decrypted code
```java
public static void dynamicMethod(Context context) throws Exception {
    pollForTombMessage();
    Log.i(TAG, "Tomb message received!");
    File generateNativeLibrary = generateNativeLibrary(context);
    try {
        System.load(generateNativeLibrary.getAbsolutePath());
    } catch (Throwable th) {
        String message = th.getMessage();
        message.getClass();
        Log.e(TAG, message);
        System.exit(-1);
    }
    Log.i(TAG, "Native library loaded!");
    if (generateNativeLibrary.exists()) {
        generateNativeLibrary.delete();
    }
    pollForAdvanceMessage();
    Log.i(TAG, "Advance message received!");
    nativeMethod();
}
private static void pollForTombMessage() throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, IllegalAccessException {
    Class<?> cls;
    do {
        SystemClock.sleep(1000L);
        cls = Class.forName("com.wall.facer.Storage");
    } while (!DynamicClass$$ExternalSyntheticBackport1.m((String) cls.getMethod("getMessage", new Class[0]).invoke(cls.getMethod("getInstance", new Class[0]).invoke(null, new Object[0]), new Object[0]), "I am a tomb"));
}

private static void pollForAdvanceMessage() throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, IllegalAccessException {
    Class<?> cls;
    do {
        SystemClock.sleep(1000L);
        cls = Class.forName("com.wall.facer.Storage");
    } while (!DynamicClass$$ExternalSyntheticBackport1.m((String) cls.getMethod("getMessage", new Class[0]).invoke(cls.getMethod("getInstance", new Class[0]).invoke(null, new Object[0]), new Object[0]), "Only Advance"));
}
```
The *`dynamicMethod`* function seems to be the main function that is run when the code is loaded. It seems to be waiting for the "I am tomb" message from the Storage class, and if the message is correct, it will load a native library. Then, it waits for the "Only Advance" message before running a native method.

As such, these are the messages we need to input into the text field. Lets try inputting them. 
![Main Page](/static/writeups/photos/wallfacer2.png)

Success? Just kidding. We have some error messages, so even though we have a IV and Key, its probably incorrect, using the provided IV and Key in the decryption confirms that it is not the correct one.

The full output is as follows:
```text
D  There are walls ahead that you'll need to face. They have been specially designed to always result in an error. One false move and you won't be able to get the desired result. Are you able to patch your way out of this mess?
E  I need a very specific file to be available. Or do I?
E  HAHAHA are you sure you've got the right input parameter?
D  Bet you can't fix the correct constant :)
E  I'm afraid I'm going to have to stop you from getting the correct key and IV.
E  Not like this...
D  The key is: z?<NKKf7m?MUg&>qBp"b9G$A!bzP&0I(
D  The IV is: apI3`ipq.?3d!t#6
```
The E messages are error messages. The fact that we are told to "patch our way" our of this match suggests we need to edit the binary in order to get it to execute what we want it to.

The presence of 4 error messages suggests there are 4 additional stages we need to pass before we can get the flag.

## Retrieving the Native Library
To understand the native library, first we need to get the Native Library Code. The following is the function that loads the Native Library
```java
public static File generateNativeLibrary(Context context) throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, IllegalAccessException, IOException {
    AssetManager assets = context.getAssets();
    Resources resources = context.getResources();
    String str = new String(Base64.decode(resources.getString(resources.getIdentifier("dir", "string", context.getPackageName())) + "=", 0));
    String[] list = assets.list(str);
    Arrays.sort(list, new Comparator() { // from class: DynamicClass$$ExternalSyntheticLambda3
        @Override // java.util.Comparator
        public final int compare(Object obj, Object obj2) {
            int m;
            m = DynamicClass$$ExternalSyntheticBackport0.m(Integer.parseInt(((String) obj).split("\\$")[0]), Integer.parseInt(((String) obj2).split("\\$")[0]));
            return m;
        }
    });
    String str2 = new String(Base64.decode(resources.getString(resources.getIdentifier("base", "string", context.getPackageName())), 0));
    File file = new File(context.getFilesDir(), "libnative.so");
    Method method = Class.forName("Oa").getMethod("a", byte[].class, String.class, byte[].class);
    FileOutputStream fileOutputStream = new FileOutputStream(file);
    try {
        for (String str3 : list) {
            InputStream open = assets.open(str + str3);
            byte[] readAllBytes = open.readAllBytes();
            open.close();
            fileOutputStream.write((byte[]) method.invoke(null, readAllBytes, str2, Base64.decode(str3.split("\\$")[1] + "==", 8)));
        }
        fileOutputStream.close();
        return file;
    } catch (Throwable th) {
        try {
            fileOutputStream.close();
        } catch (Throwable th2) {
            Throwable.class.getDeclaredMethod("addSuppressed", Throwable.class).invoke(th, th2);
        }
        throw th;
    }
}
```
The above code fetches all the files in the directory specified in the "dir" asset. Looking at *`strings.xml`* again, the dir refers to *`"ZGF0YS8"`*. This decodes to *`"data/"`*. 

Each file in this directory is in the form *`{num}${code}`*. The files are then sorted by *`num`* and concatenated to form the base64 encoded string in the "base" asset. The files are then decrypted using the Oa.a method, concantenated, and written to the *`libnative.so`* file.

The encrypted file data, *`str2`* is passed into the Oa.a method, as well as the *`code`* from the filename is passed into the Oa.a method. The Oa.a method is likely the method that decrypts the file data. *`str2`* is *`d2FsbG93aW5wYWlu`* (from strings.xml) which decodes to *`wallowinpain`*. 

We likely need to edit the binary and re-encrypt it so the application can load it again. Lets take a look at the *`Oa.a`* method to see how it works and wheter we can reverse it.
```java_RETRACT
/* loaded from: classes.dex */
public class Oa {
    public static byte[] a(byte[] bArr, String str, byte[] bArr2) {
        byte[] b = b(str, bArr2);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        byte[] bArr3 = new byte[12];
        int length = bArr.length - 12;
        byte[] bArr4 = new byte[length];
        System.arraycopy(bArr, 0, bArr3, 0, 12);
        System.arraycopy(bArr, 12, bArr4, 0, length);
        cipher.init(2, new SecretKeySpec(b, "AES"), new GCMParameterSpec(128, bArr3));
        return cipher.doFinal(bArr4);
    }

    private static byte[] b(String str, byte[] bArr) {
        return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(new PBEKeySpec(str.toCharArray(), bArr, 16384, 256)).getEncoded();
    }
}
```
The above code decrypts the file using AES/GCM/NoPadding. The key is generated using the PBKDF2WithHmacSHA256 algorithm, using the password and salt provided. The password seems to be *`str2`* passed from the library loader, which was *`wallowinpain`*, and the salt is the *`code`* located at the end of the filename. The key is then used to decrypt the file.

We can use the above code to decrypt the file. To reencrypt the file, we can use the following code (Written with ChatGPT):
```python_RETRACT
from Crypto.Cipher import AES
from hashlib import pbkdf2_hmac
import base64
import os

def encrypt_native_so_to_asset_files(input_file, output_dir, base64_key, file_list):
    # Decode the base64 key
    password = base64.b64decode(base64_key).decode('utf-8')
    
    # Read the contents of the .so file
    with open(input_file, 'rb') as f:
        data = f.read()
    
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Current position in the input data
    data_offset = 0
    total_data_length = len(data)
    cur_data_length = 0
    for chunk_index, file_name in enumerate(file_list):
        # Extract the salt from the filename
        split_name = file_name.split('$')
        if len(split_name) < 2:
            print(f"Invalid file name format: {file_name}")
            continue
        
        # Decode the base64 segment extracted from the filename
        base64_segment = split_name[1] + "=="
        salt = base64.urlsafe_b64decode(base64_segment)
        
        # Derive the AES key using PBKDF2 with HMAC-SHA256
        key = pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 16384, 32)
        
        # Determine the size of the data chunk to be processed (use 1024 bytes or remaining data)
        chunk_size = (total_data_length - data_offset)//(len(file_list)-chunk_index)
        chunk_data = data[data_offset:data_offset + chunk_size]
        data_offset += chunk_size
        
        # Encrypt the data using AES-GCM with a 12-byte nonce
        nonce = os.urandom(12)  # Generate a 12-byte nonce
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        encrypted_data, tag = cipher.encrypt_and_digest(chunk_data)  # Encrypt and generate the tag

        # Combine encrypted data, nonce, and tag
        final_encrypted_data = nonce + encrypted_data + tag
        print(len(final_encrypted_data),len(chunk_data),len(encrypted_data),len(tag))
        cur_data_length += len(encrypted_data)
        # Ensure the output data length matches the expected chunk size + 12 (nonce) + 16 (tag)
        assert len(final_encrypted_data) == len(chunk_data) + 16 + 12, f"Mismatch in encrypted data length for chunk {chunk_index}"
        
        # Write the encrypted data chunk to the corresponding output file
        chunk_file_path = os.path.join(output_dir, file_name)
        with open(chunk_file_path, 'wb') as chunk_file:
            chunk_file.write(final_encrypted_data)

        print(f"Chunk {chunk_index} written to {chunk_file_path} with salt {salt}")
    print(cur_data_length,len(data))
    assert cur_data_length == len(data), "Data offset does not match the input data length"
    print(f"Encryption complete. The encrypted files are saved in the directory: {output_dir}")

# Usage:
input_file = "libnative.so"  # Input .so file that you want to encrypt
output_dir = "encrypted_assets"  # Output directory to store encrypted files
base64_key = "d2FsbG93aW5wYWlu"  # The base64 encoded key
file_list = [
    "0$d4a1NDA5TkDcvPPA_97qGA", "1$-jdd8_tomhupBCl9KWd8xA", "2$lFLwXjQ9kfzjBqIAI43f-Q",
    "3$JwwVFYd1_JvfrcL91sUOoQ", "4$Xz61-8GuN_p5gECXlLwIyA", "5$Je3mRGwJ1MvkQ-ZXfApZgQ",
    "6$KrPqTP4Iu8-DNlpja70rcA", "7$K30_BnqsT-e6-qRdbWhW4Q", "8$svSIG6hueT4M509sCJTACQ"
]

encrypt_native_so_to_asset_files(input_file, output_dir, base64_key, file_list)
```

Now that we have the library being loaded, we can use ghidra or similar reverse engineering programmes to decompile the library to understand it better. Here is the entry point of the library, which is a function named *`Java_DynamicClass_nativeMethod`*
```c
void Java_DynamicClass_nativeMethod(undefined8 param_1)

{
  undefined4 uVar1;
  
  __android_log_print(3,&DAT_00100a2f,
                      "There are walls ahead that you\'ll need to face. They have been specially des igned to always result in an error. One false move and you won\'t be able to g et the desired result. Are you able to patch your way out of this mess?"
                     );
  uVar1 = FUN_00103230();
  uVar1 = FUN_00101eb0(uVar1);
  uVar1 = FUN_00101f90(param_1,uVar1);
  FUN_001023f0(param_1,uVar1);
  return;
}
```
We see an *`__andriod_log_print`*, which is the function used to log messages into the logcat. Since we see this message in our own logcat, we know that we are on the right track.

There are 4 different functions being called. We can guess that these correspond to the 4 different error messages (walls) we need to resolve. From here, we can start tackling each error message in the application one by one.

## Wall 1: I need a very specific file to be available. Or do I?
We can search for this string in the library to see where this error is logged. (Ghidra couldn't decompile this very well, so I used Hex Rays for this)
```c
char filename[] = "/sys/wall/facer"; // idb
...
v0 = sys_openat(-100, filename, 0, 0);
switch ( (unsigned __int64)jpt_330B )
{
case 0uLL:
    v4 = sub_3370(1, 8);
    v5 = sub_3370(v4, 5);
    v6 = sub_3370(v5, 8);
    __android_log_print(4LL, "TISC", "One wall down!");
    break;
case 1uLL:
    v1 = sub_3370(1, 4);
    v2 = sub_3370(v1, 6);
    v6 = sub_3370(v2, 5);
    __android_log_print(6LL, "TISC", "I need a very specific file to be available. Or do I?");
    break;
}
return v6;
```
This code checks for the presence of the *`/sys/wall/facer`* file, and only lets us proceed when this file is present. Unfortunately, since this file is located in the sys directory, its a little difficult to edit it, as I am using andriod studio, and am not rooted.

Another way to solve this is to edit the filename to be something else. We locate the string *`/sys/wall/facer`* in the binary and change it to another file that already exists in the system. We must ensure that the total length of the filename stays the same, such that the binary’s structure and offsets remain unchanged to prevent any errors. I choose to set it to *`/bin/e2freefrag`*. 

Re-encrypting the binary and loading it into the application, we can see that the first wall has been bypassed.
![Wall 1](/static/writeups/photos/wallfacer3.png)

## Wall 2: HAHAHA are you sure you've got the right input parameter?
Once again, we can search for the string in the library to see where this error is logged. 
```c
void FUN_00103430(int param_1)
{
  switch(param_1 == 0x539) {
  case false:
    __android_log_print(6,&DAT_00100a2f,"HAHAHA are you sure you\'ve got the right input parameter? ");
    (*(code *)PTR_LAB_00105ba8)();
    return;
  case true:
    __android_log_print(4,&DAT_00100a2f,"Input verification success!");
    (*(code *)PTR_LAB_00105b98)();
    return;
  }
}
```

The above function seems to check wheter the input parameter is equal to 0x539. If it is, then it will log a success message. We can take a look at the *`Incoming References`* in ghidra to see where this function is called in the programme. The following is the machine code for this function call
![Wall 2 Code](/static/writeups/photos/wallfacer4.png)
The MOV seems to be moving the value 0x01 into the register, which is then pushed onto the stack. This is likely the parameter being passed into the function. We can change this value to 0x539 to bypass the wall. Since the programme uses [Little Endian](https://en.wikipedia.org/wiki/Endianness), we need to change the value to *`0x39 0x05`*.

Thus, locate this address in the binary, and change the value to *`0x39 0x05`*. Re-encrypt the binary and load it into the application. 

With this, the second wall has been bypassed.
![Wall 2](/static/writeups/photos/wallfacer5.png)

## Wall 3: I'm afraid I'm going to have to stop you from getting the correct key and IV.
The message logged before this wall is *`Bet you can't fix the correct constant :)`*. This suggests that we need to change a constant in the binary to bypass this wall.

As before, we find the string in the binary to see where this error is logged.
```c
void FUN_001035b0(int param_1)

{
  __android_log_print(3,&DAT_00100a2f,"Bet you can\'t fix the correct constant :)");
  switch(param_1 == 0x539) {
  case false:
    __android_log_print(6,&DAT_00100a2f,
                        "I\'m afraid I\'m going to have to stop you from getting the correct key and  IV."
                       );
    (*(code *)PTR_LAB_00105bc8)();
    return;
  case true:
    (*(code *)PTR_LAB_00105bc8)();
    return;
  }
}
```
Similar to the previous function, this checks if the parameter is equal to 0x539. We can take a look at where this function is called in the programme again:
```c
undefined4 FUN_00101f90(long *param_1,uint param_2)
{
  ...
  ...
  sprintf(local_1f,"%d",(ulong)param_2);
  local_28 = (**(code **)(*local_10 + 0x538))(local_10,local_1f);
  local_30 = (**(code **)(*local_10 + 0x30))(local_10,"java/security/MessageDigest");
  local_38 = (**(code **)(*local_10 + 0x388))
                       (local_10,local_30,"getInstance",
                        "(Ljava/lang/String;)Ljava/security/MessageDigest;");
  local_40 = (**(code **)(*local_10 + 0x108))(local_10,local_30,"update","([B)V");
  local_48 = (**(code **)(*local_10 + 0x108))(local_10,local_30,"digest",&DAT_0010096b);
  local_50 = (**(code **)(*local_10 + 0x538))(local_10,"SHA-1");
  local_58 = (**(code **)(*local_10 + 0x390))(local_10,local_30,local_38,local_50);
  uVar3 = (**(code **)(*local_10 + 0xf8))(local_10,local_28);
  local_60 = (*pcVar1)(plVar2,uVar3,"getBytes",&DAT_0010096b);
  ...
  local_88 = (long)local_74;
  local_90 = local_80;
  local_94 = 0;
  for (local_98 = 0; local_98 < 0x14; local_98 = local_98 + 1) {
    local_94 = (uint)*(byte *)(local_80 + local_98) + local_94;
  }
  local_14 = FUN_001035b0(local_94,local_14);
}

```
I've attempted to remove irrelevant code. The function *`FUN_001035b0`* is called with the value *`local_94`*. *`local_94`* is the sum of SHA-1 hash of the *`local_1f`* string. 

The first line *`sprintf(local_1f,"%d",(ulong)param_2);`* is used to assign *`local1_f`*, by converting the integer to a string, by using the *`%d`* format specifier.

We could try to located where *`param_2`* is assigned, but since *`sprintf`* is used, we can simply change the format specifier to be our own string value. This will cause param_2 to not be included in the *`local_1f`* variable, and instead it will be our own string.

For instance, changing *`sprintf(local_1f,"%d",(ulong)param_2);`* to *`sprintf(local_1f,"hi",(ulong)param_2);`* will cause *`local_1f`* to be *`hi`* instead of the integer value.

Once again, we can located the address where the original format specifier is located, and change it to our own string. 
![Wall 3 Format Specifier](/static/writeups/photos/wallfacer6.png)

We note that the string is only 2 bytes long, so our payload must also be 2 bytes long. We need to find a 2 byte string that will not cause any errors in the programme. However, 2 bytes is not enough bytes to find a payload in which the SHA-1 hash will sum to 0x539. 

From the above screenshot, we see that the memory stored right after the format specifier is the value "SHA-1". Since the last bit is used as the null terminator, if we instead set the null terminator to be our own value, for instance "X" then the format specifier will be concantenated with the next memory value, "SHA-1" and become "hiXSHA-1". This gives us one extra byte to work with, which should be sufficient to find a string that will sum to 0x539.

The following is the code to find the string who's SHA-1 hash will sum to 0x539.
```python_RETRACT
import hashlib

target_sum = 1337  # The target sum in decimal (0x539)

for char_1 in range(0, 128):  
    for char_2 in range(0, 128):
        for char_3 in range(0,128):
            to_encode = [char_1, char_2, char_3]
            param_2_str = ''.join([chr(c) for c in to_encode]) + "SHA-1"
            
            # Compute SHA-1 hash
            sha1_hash = hashlib.sha1(param_2_str.encode()).digest()
            
            # Calculate the sum of the hash's bytes
            byte_sum = sum(sha1_hash)
            
            if byte_sum == target_sum:
                print(f"Found matching value: {[hex(i) for i in to_encode]}")
                print(f"SHA-1 hash: {sha1_hash.hex()}")
                break
# OUTPUT: ['0x28', '0x20', '0x49']
```
Locate the address of the format specifier, and change it to the above value. Re-encrypt the binary and load it into the application.
![Wall 3](/static/writeups/photos/wallfacer7.png)

## Wall 4: Not like this...
This time, searching for the string in the binary gives us some weird results. There is no incoming call of the function found by ghidra. This suggests that the function is being called indirectly.

There also seems to be 2 different functions which use the string. Each of these functions have a pointer which points to the address of these functions.
![Wall 4 Pointer](/static/writeups/photos/wallfacer8.png)
![Wall 4 Pointer](/static/writeups/photos/wallfacer9.png)

In addition, there seems to be a seperate success function.
```c
void UndefinedFunction_001036e4(void)
{
  ...
  __android_log_print(4,&DAT_00100a2f,"I guess it\'s time to reveal the correct key and IV!");
  (**(code **)(*(long *)(unaff_RBP + -0x70) + (long)*(int *)(unaff_RBP + -0x74) * 8))();
}

```
This success function also has a pointer which points to the address of the function.
![Wall 4 Pointer](/static/writeups/photos/wallfacer10.png)
![Wall 4 Pointer](/static/writeups/photos/wallfacer11.png)

We have 2 failure functions and 1 success function. We could try to investigate where these functions are being called. However, I found that we can actually simply change these pointers such that even the failure pointers point to the success function. This means that no matter which function is called, the success function will always be ran instead.

Thus, locate the address of the failure pointers, and change the address stored at the location to the address of the success function (0xe436) instead, and re-encrypt the binary to load it into the application.
![Wall 4](/static/writeups/photos/wallfacer12.png)

Success! We seem to have resolved all the error messages

## Decrypting the Flag
The final message we received is:
```text
The key is: eU9I93-L9S9Z!:6;:i<9=*=8^JJ748%%
The IV is: R"VY!5Jn7X16`Ik]
```
Plugging these values into the decryption function in the application, we can decrypt the flag.

## Flag
```text
Decrypted data: b'The flag is: TISC{1_4m_y0ur_w4llbr34k3r_!i#Leb}'
```

## Resources
[jadx](https://github.com/skylot/jadx) <br>
[APKLab](https://github.com/APKLab/APKLab) <br>
[Andriod Studio](https://developer.android.com) <br>
[Dynamic Code Loading](https://erev0s.com/blog/3-ways-for-dynamic-code-loading-in-android/) 
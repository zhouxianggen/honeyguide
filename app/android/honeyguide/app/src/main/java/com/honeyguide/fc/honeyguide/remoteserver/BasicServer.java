package com.honeyguide.fc.honeyguide.remoteserver;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/1/21.
 */
public class BasicServer {
    private String remoteServerAddress;

    public void setRemoteServerAddress(String address) {
        remoteServerAddress = address;
    }

    public String post(String data) {
        if (remoteServerAddress.isEmpty()) {
            return "";
        }
        try {
            HttpClient client = new DefaultHttpClient();
            HttpPost post = new HttpPost(remoteServerAddress);
            InputStream stream = new ByteArrayInputStream(data.getBytes(StandardCharsets.UTF_8));
            InputStreamEntity reqEntity = new InputStreamEntity(stream, -1);
            reqEntity.setChunked(true);
            post.setEntity(reqEntity);
            HttpResponse response = client.execute(post);
            HttpEntity resEntity = response.getEntity();

            if (resEntity != null) {
                InputStream inputStream = resEntity.getContent();
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                StringBuilder stringBuilder = new StringBuilder();
                String line;
                while ((line = bufferedReader.readLine()) != null) {
                    stringBuilder.append(line);
                }
                inputStream.close();
                return stringBuilder.toString();
            }
        } catch (IOException e) {
            return "";
        }
        return "";
    }

    public String post( List<NameValuePair> params) {
        if (remoteServerAddress.isEmpty()) {
            return "";
        }
        try {
            HttpClient client = new DefaultHttpClient();
            HttpPost post = new HttpPost(remoteServerAddress);

            post.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
            HttpResponse response = client.execute(post);
            HttpEntity entity = response.getEntity();

            if (entity != null) {
                InputStream inputStream = entity.getContent();
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                StringBuilder stringBuilder = new StringBuilder();
                String line;
                while ((line = bufferedReader.readLine()) != null) {
                    stringBuilder.append(line);
                }
                inputStream.close();
                return stringBuilder.toString();
            }
        } catch (IOException e) {
            return "";
        }
        return "";
    }
}

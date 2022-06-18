using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using NativeWebSocket;

public class Connection : MonoBehaviour
{
  WebSocket websocket;
  public static Action<Room> InNewRoom;

  public string port;
  // Start is called before the first frame update
  async void Start()
  {
    websocket = new WebSocket("ws://localhost:"+port);

    websocket.OnOpen += () =>
    {
      Debug.Log("Connection open!");
    };

    websocket.OnError += (e) =>
    {
      Debug.Log("Error! " + e);
    };

    websocket.OnClose += (e) =>
    {
      Debug.Log("Connection closed!");
    };

    websocket.OnMessage += (bytes) =>
    {
      var message = System.Text.Encoding.UTF8.GetString(bytes);
      Debug.Log(message);
      var mData = JsonUtility.FromJson<Message>(message);
      if (mData.message == "inNewRoom")
      {
        InNewRoom?.Invoke(JsonUtility.FromJson<Room>(mData.data));
      }
      else
      {
        Debug.Log("unhandled receive: "+message);
      }
    };
    
    // waiting for messages
    await websocket.Connect();
  }

  void Update()
  {
    #if !UNITY_WEBGL || UNITY_EDITOR
      websocket.DispatchMessageQueue();
    #endif
  }

  public async void SendMessage(Message m)
  {
    if (websocket.State == WebSocketState.Open)
    {
      await websocket.SendText(JsonUtility.ToJson(m));
    }
  }

  private async void OnApplicationQuit()
  {
    await websocket.Close();
  }

}
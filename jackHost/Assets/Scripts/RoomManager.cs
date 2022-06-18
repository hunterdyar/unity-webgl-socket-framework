using System;
using TMPro;
using UnityEngine;
public class RoomManager : MonoBehaviour
{
	private Connection _connection;
	public TMP_Text roomIDText;
	private void Awake()
	{
		_connection = GetComponent<Connection>();
	}

	private void OnEnable()
	{
		Connection.InNewRoom += OnNewRoom;
	}

	private void OnDisable()
	{
		Connection.InNewRoom -= OnNewRoom;
	}

	public void OnNewRoom(Room r)
	{
		roomIDText.text = r.id;
	}

	public void CreateRoom()
	{
		Message m = new Message();
		m.message = "newRoom";
		_connection.SendMessage(m);
	}
}

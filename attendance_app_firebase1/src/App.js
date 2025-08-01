import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { collection, getDocs, setDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const penaltyRules = (count) => {
  if (count >= 17) return 0;
  if (count >= 11) return 2000;
  if (count >= 7) return 10000;
  if (count >= 2) return 12000;
  if (count >= 1) return 20000;
  return 20000;
};

export default function AttendanceApp() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];
  const currentMonth = todayDate.toISOString().slice(0, 7);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      if (!selectedUser && userList.length > 0) setSelectedUser(userList[0]);
    });
    return () => unsub();
  }, []);

  const markToday = async () => {
    if (!selectedUser) return;
    const userRef = doc(db, "users", selectedUser.id);
    const updatedDates = Array.from(new Set([...(selectedUser.attendance || []), today]));
    await updateDoc(userRef, { attendance: updatedDates });
  };

  const markMissedDays = async (dates) => {
    if (!selectedUser) return;
    const userRef = doc(db, "users", selectedUser.id);
    const updatedDates = Array.from(new Set([...(selectedUser.attendance || []), ...dates]));
    await updateDoc(userRef, { attendance: updatedDates });
  };

  const waivePenalty = async (userIds) => {
    for (const id of userIds) {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { waived: true });
    }
  };

  const addUser = async (name) => {
    const id = uuidv4();
    await setDoc(doc(db, "users", id), { name, attendance: [], waived: false, role: "user" });
  };

  const removeUser = async (id) => {
    // Firestore에서는 직접 삭제 구현 필요
  };

  const currentAttendance = selectedUser?.attendance?.filter(d => d.startsWith(currentMonth)) || [];
  const penalty = selectedUser?.waived ? 0 : penaltyRules(currentAttendance.length);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '10px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>{selectedUser?.name || "사용자 선택"} 출석 관리</h2>
      <select onChange={(e) => setSelectedUser(users.find(u => u.id === e.target.value))}>
        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
      </select>
      <p>오늘 날짜: {today}</p>
      <button onClick={markToday} style={{ background: 'green', color: 'white', padding: '10px', margin: '5px' }}>오늘 출석</button>
      <button onClick={() => markMissedDays(['2025-07-28', '2025-07-29'])} style={{ background: 'orange', color: 'white', padding: '10px', margin: '5px' }}>누락일 추가</button>
      <h3>벌금 금액: {penalty.toLocaleString()}원</h3>
      <p>출석 횟수: {currentAttendance.length}회</p>
      <p>출석일: {currentAttendance.join(', ') || '없음'}</p>
      <hr />
      {isAdmin && (
        <div>
          <h3>관리자 메뉴</h3>
          <input type="text" placeholder="닉네임 검색" />
          <button onClick={() => waivePenalty(users.map(u => u.id))}>전체 벌금 면제</button>
          <button onClick={() => addUser(prompt('추가할 이름 입력'))}>회원 추가</button>
        </div>
      )}
    </div>
  );
}

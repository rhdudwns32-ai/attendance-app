import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const sampleUsers = [
  { id: 'u1', name: '홍길동', history: { '2025-07': [] } },
  { id: 'u2', name: '김영희', history: { '2025-07': [] } },
  { id: 'u3', name: '박철수', history: { '2025-07': [] } },
];

const penaltyRules = (count) => {
  if (count >= 17) return 0;
  if (count >= 11) return 2000;
  if (count >= 7) return 10000;
  if (count >= 2) return 12000;
  if (count >= 1) return 20000;
  return 20000;
};

export default function AttendanceApp() {
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];
  const currentMonth = todayDate.toISOString().slice(0, 7);

  const markToday = () => {
    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        const monthData = user.history[currentMonth] || [];
        if (!monthData.includes(today)) {
          return {
            ...user,
            history: {
              ...user.history,
              [currentMonth]: [...monthData, today]
            }
          };
        }
      }
      return user;
    }));
  };

  const markMissedDays = (dates) => {
    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        const monthData = user.history[currentMonth] || [];
        const merged = Array.from(new Set([...monthData, ...dates]));
        return {
          ...user,
          history: {
            ...user.history,
            [currentMonth]: merged
          }
        };
      }
      return user;
    }));
  };

  const currentAttendance = selectedUser.history[currentMonth] || [];
  const penalty = penaltyRules(currentAttendance.length);

  const waivePenalty = (userId) => {
    alert(`${users.find(u => u.id === userId).name} 벌금 면제 처리 완료`);
  };

  const addUser = (name) => {
    const newUser = { id: uuidv4(), name, history: { [currentMonth]: [] } };
    setUsers([...users, newUser]);
  };

  const removeUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const ranking = [...users].sort((a, b) => (b.history[currentMonth]?.length || 0) - (a.history[currentMonth]?.length || 0));

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '10px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>{selectedUser.name} 출석 관리</h2>
      <p>오늘 날짜: {today}</p>
      <button onClick={markToday} style={{ background: 'green', color: 'white', padding: '10px', margin: '5px' }}>오늘 출석</button>
      <button onClick={() => markMissedDays(['2025-07-28', '2025-07-29'])} style={{ background: 'orange', color: 'white', padding: '10px', margin: '5px' }}>누락일 추가</button>
      <h3>벌금 금액: {penalty.toLocaleString()}원</h3>
      <p>출석 횟수: {currentAttendance.length}회</p>
      <p>출석일: {currentAttendance.join(', ') || '없음'}</p>
      <hr />
      <h3>타 이용자 출석 현황 ({currentMonth})</h3>
      {users.map(user => (
        <p key={user.id}>{user.name}: {(user.history[currentMonth]?.length || 0)}회</p>
      ))}
      <hr />
      <button onClick={() => setIsAdmin(!isAdmin)} style={{ background: 'blue', color: 'white', padding: '10px', margin: '5px' }}>
        {isAdmin ? '관리자 모드 해제' : '관리자 모드'}
      </button>
      {isAdmin && (
        <div>
          <h3>관리자 메뉴</h3>
          <h4>벌금 면제</h4>
          {users.map(user => (
            <button key={user.id} onClick={() => waivePenalty(user.id)} style={{ margin: '5px' }}>{user.name} 벌금 면제</button>
          ))}
          <h4>회원 관리</h4>
          <button onClick={() => addUser(prompt('추가할 이름 입력'))} style={{ margin: '5px' }}>회원 추가</button>
          {users.map(user => (
            <button key={user.id} onClick={() => removeUser(user.id)} style={{ margin: '5px', background: 'red', color: 'white' }}>{user.name} 삭제</button>
          ))}
          <h4>출석률 순위 ({currentMonth})</h4>
          {ranking.map((user, index) => (
            <p key={user.id}>{index + 1}위: {user.name} - {(user.history[currentMonth]?.length || 0)}회</p>
          ))}
        </div>
      )}
    </div>
  );
}

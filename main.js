
const BASE_URL = 'http://3.37.173.166:8000';


const writeBtn = document.getElementById('writeBtn');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');

writeBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

let posts = [];
const form = document.getElementById('guestbookForm');


// POST
form.addEventListener('submit', async (e) => {
  e.preventDefault();  // 페이지 새로고침 방지

  const response = await fetch(`${BASE_URL}/posts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: form.title.value,
      author: form.author.value,
      content: form.content.value,
      password: form.password.value,
    }),
  });

  const newPost = await response.json();

  posts.unshift(newPost);  // 최신순으로 맨 앞에 추가
  renderPosts();
  
  form.reset();  // 입력창 초기화
  modal.style.display = 'none';  // 모달 닫기

});



let selectedPostId = null;

function renderPosts() {
  const container = document.getElementById('container');
  container.innerHTML = '';
  
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>

      <div class="card-footer">
        <span>${post.author}</span>
        <span>${post.created_at.slice(0, 16).replace('T', ' ')}</span>
        <button class="deleteBtn" data-id="${post.id}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPostId = btn.dataset.id;     // data-id처럼 data-로 시작하는 속성을 JS에서 가져올 때 dataset.id로 접근
      document.getElementById('deleteModal').style.display = 'flex';   //none으로 되어있던 모달 열기
    });
  });
}

// GET
async function getData() {
  const response = await fetch(`${BASE_URL}/posts/`);
  const data = await response.json();
  posts = data;
  renderPosts();
}

getData();

// 취소 버튼
document.getElementById('cancel').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  document.getElementById('deletePassword').value = '';
});

// 삭제 확인 버튼, DELETE
document.getElementById('confirm').addEventListener('click', async () => {
  const password = document.getElementById('deletePassword').value;

  if (!password) {
    alert('비밀번호를 입력해주세요');
    return;
  }

  const response = await fetch(`${BASE_URL}/posts/${selectedPostId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: password })
  });

  if (response.ok) {
    posts = posts.filter(p => p.id != selectedPostId); // 삭제된 게시글을 제외한 나머지만 남기기
    renderPosts(); // 변경된 posts로 카드 목록 다시 그리기
    document.getElementById('deleteModal').style.display = 'none';
    document.getElementById('deletePassword').value = '';
  } else {
    alert('비밀번호가 틀렸습니다.');
  }
});


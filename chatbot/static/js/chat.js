document.addEventListener('DOMContentLoaded', function() {
    const helpButton = document.querySelector('.help-button');
    const chatGuide = document.querySelector('.chat-guide');

    // 요소 존재 확인
    if (!helpButton || !chatGuide) {
        console.error('필요한 요소를 찾을 수 없습니다:', {
            helpButton: !!helpButton,
            chatGuide: !!chatGuide
        });
        return;
    }

    // 초기에 가이드 숨기기
    chatGuide.style.display = 'none';

    // 버튼 클릭 시 가이드 토글
    helpButton.addEventListener('click', function() {
        if (chatGuide.style.display === 'none') {
            chatGuide.style.display = 'flex';
            chatGuide.style.opacity = '1';
        } else {
            chatGuide.style.opacity = '0';
            setTimeout(() => {
                chatGuide.style.display = 'none';
            }, 300);
        }
    });
});

    // 초기에 가이드 숨기기
    guideContent.style.display = 'none';

    // 첫 방문 체크 및 가이드 표시
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            guideContent.style.display = 'flex';
            guideContent.style.opacity = '1';
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }

    // 이용 가이드 버튼 클릭 이벤트
    helpButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (guideContent.style.display === 'none') {
            // 가이드 보이기
            guideContent.style.display = 'flex';
            setTimeout(() => {
                guideContent.style.opacity = '1';
            }, 10);
        } else {
            // 가이드 숨기기
            guideContent.style.opacity = '0';
            setTimeout(() => {
                guideContent.style.display = 'none';
            }, 300);
        }
    });

    // DOM 요소 가져오기
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // DOM 요소 존재 확인
    if (!messageInput || !sendButton || !chatMessages) {
        console.error('필요한 DOM 요소를 찾을 수 없습니다:', {
            messageInput: !!messageInput,
            sendButton: !!sendButton,
            chatMessages: !!chatMessages
        });
        return;
    }
// 로딩 중
document.querySelector('.loading').style.display = 'block';

// 로딩 후
document.querySelector('.loading').style.display = 'none';
    // 메시지 전송 함수
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // 사용자 메시지 표시
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'message user-message';
            userMessageDiv.textContent = message;
            chatMessages.appendChild(userMessageDiv);

            // 입력창 비우기
            messageInput.value = '';

            // 스크롤
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // API 호출
            fetch('/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                // 봇 응답 표시
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'message bot-message';
                botMessageDiv.textContent = data.response;
                chatMessages.appendChild(botMessageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(error => {
                console.error('Error:', error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'message bot-message error';
                errorDiv.textContent = '죄송합니다. 오류가 발생했습니다.';
                chatMessages.appendChild(errorDiv);
            });
        }
    }

    // 이벤트 리스너 등록
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });


// CSRF 토큰 가져오기
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}
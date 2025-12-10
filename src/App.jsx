import { useState, useEffect, useRef } from 'react'

// 샘플 데이터
const PROFILE = {
  username: 'ara',
  name: '아라',
  bio: 'yours, only yours 🤍\nstill falling for you everyday',
  avatar: '/profile.jpg',
  posts: 42,
  followers: '95K',
  following: 1
}

// 하이라이트 (나중에 동적으로 변경 가능)
const HIGHLIGHTS = [
  { id: 1, title: '일상', avatar: 'https://picsum.photos/seed/h1/100/100', images: [] },
  { id: 2, title: '여행', avatar: 'https://picsum.photos/seed/h2/100/100', images: [] },
  { id: 3, title: '작업', avatar: 'https://picsum.photos/seed/h3/100/100', images: [] },
]

// SVG 아이콘들
const Icons = {
  Home: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"/>
    </svg>
  ),
  Search: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"/>
    </svg>
  ),
  Reels: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964v12.073a5 5 0 0 1-5 5H6.018a5 5 0 0 1-5-5V8.002Z"/>
    </svg>
  ),
  Heart: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/>
    </svg>
  ),
  User: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12.004" cy="12.004" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/>
      <path d="M18.793 20.014a6.08 6.08 0 0 0-1.778-2.447 3.991 3.991 0 0 0-2.386-.791H9.38a3.994 3.994 0 0 0-2.386.791 6.09 6.09 0 0 0-1.779 2.447" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/>
      <circle cx="12.006" cy="9.718" fill="none" r="4.109" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/>
    </svg>
  ),
  Grid: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <rect fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="10" x="2" y="2"/>
      <rect fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="10" x="12" y="2"/>
      <rect fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="10" x="2" y="12"/>
      <rect fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="10" x="12" y="12"/>
    </svg>
  ),
  Tagged: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h2.55a1.59 1.59 0 0 1 1.59 1.59v2.55c0 .422.167.826.466 1.124l1.799 1.799-1.799 1.799a1.59 1.59 0 0 0-.466 1.124v2.55a1.59 1.59 0 0 1-1.59 1.59h-2.55a1.59 1.59 0 0 0-1.124.466l-1.799 1.799-1.799-1.799a1.59 1.59 0 0 0-1.124-.466h-2.55a1.59 1.59 0 0 1-1.59-1.59v-2.55a1.59 1.59 0 0 0-.466-1.124l-1.799-1.799 1.799-1.799a1.59 1.59 0 0 0 .466-1.124v-2.55a1.59 1.59 0 0 1 1.59-1.59h2.55a1.59 1.59 0 0 0 1.124-.465Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
      <circle cx="12" cy="12" fill="none" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Plus: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z"/>
    </svg>
  ),
  Messenger: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"/>
      <path d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z"/>
    </svg>
  ),
  Verified: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="verified-badge">
      <circle cx="12" cy="12" r="10" fill="#0095f6"/>
      <path d="M10.5 15.5L7 12l1.4-1.4 2.1 2.1 4.6-4.6L16.5 9.5l-6 6z" fill="#fff"/>
    </svg>
  ),
  Close: () => (
    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="3" y2="21"/>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="21" y2="3"/>
    </svg>
  )
}

// Header 컴포넌트
function Header({ username, onSettingsClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-username">{username}</span>
        <Icons.Verified />
        <svg className="header-dropdown" fill="currentColor" viewBox="0 0 24 24" width="12" height="12">
          <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z"/>
        </svg>
      </div>
      <div className="header-icons">
        <button className="header-settings" onClick={onSettingsClick}>
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 8a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/>
            <path d="M12 4V1m0 22v-3M4 12H1m22 0h-3M6.3 6.3 4.2 4.2m15.6 15.6-2.1-2.1M6.3 17.7l-2.1 2.1M19.8 4.2l-2.1 2.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

// Highlights 컴포넌트
function Highlights({ highlights, onHighlightClick }) {
  return (
    <div className="stories-container">
      <div className="story-item">
        <div className="story-ring new-highlight">
          <div className="new-highlight-plus">+</div>
        </div>
        <span className="story-username">새로 만들기</span>
      </div>
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="story-item"
          onClick={() => onHighlightClick(highlight)}
        >
          <div className="story-ring">
            <img className="story-avatar" src={highlight.avatar} alt={highlight.username} />
          </div>
          <span className="story-username">{highlight.title || highlight.username}</span>
        </div>
      ))}
    </div>
  )
}

// Profile Header 컴포넌트
function ProfileHeader({ profile }) {
  return (
    <div className="profile-header">
      <div className="profile-info">
        <div className="profile-avatar-container">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-inner">
              <img className="profile-avatar" src={profile.avatar} alt={profile.username} />
            </div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-number">{profile.posts}</span>
            <span className="stat-label">게시물</span>
          </div>
          <div className="stat">
            <span className="stat-number">{profile.followers}</span>
            <span className="stat-label">팔로워</span>
          </div>
          <div className="stat">
            <span className="stat-number">{profile.following}</span>
            <span className="stat-label">팔로잉</span>
          </div>
        </div>
      </div>
      <div className="profile-bio">
        <div className="profile-name">{profile.name} <Icons.Verified /></div>
        <div className="profile-bio-text">{profile.bio}</div>
      </div>
      <div className="profile-actions">
        <button className="btn btn-primary">팔로우</button>
        <button className="btn btn-secondary">메시지</button>
      </div>
    </div>
  )
}

// Tab Bar 컴포넌트
function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      <div className={`tab ${activeTab === 'grid' ? 'active' : ''}`} onClick={() => onTabChange('grid')}>
        <Icons.Grid />
      </div>
      <div className={`tab ${activeTab === 'reels' ? 'active' : ''}`} onClick={() => onTabChange('reels')}>
        <Icons.Reels />
      </div>
    </div>
  )
}

// Gallery 컴포넌트
function Gallery({ posts, onPostClick }) {
  return (
    <div className="gallery">
      {posts.map((post, index) => (
        <div key={post.id} className="gallery-item" onClick={() => onPostClick(index)}>
          <img className="gallery-image" src={post.image} alt={post.caption || 'Post'} />
        </div>
      ))}
    </div>
  )
}

// Bottom Navigation 컴포넌트
function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="nav-item"><Icons.Home /></div>
      <div className="nav-item"><Icons.Search /></div>
      <div className="nav-item"><Icons.Plus /></div>
      <div className="nav-item"><Icons.Reels /></div>
      <div className="nav-item"><Icons.User /></div>
    </nav>
  )
}

// Story Viewer 컴포넌트
function StoryViewer({ story, profile, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const STORY_DURATION = 5000 // 5초

  useEffect(() => {
    const interval = 50
    const increment = (interval / STORY_DURATION) * 100

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < story.images.length - 1) {
            setCurrentIndex(i => i + 1)
            return 0
          } else {
            onClose()
            return 100
          }
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, story.images.length, onClose])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setProgress(0)
    }
  }

  const handleNext = () => {
    if (currentIndex < story.images.length - 1) {
      setCurrentIndex(i => i + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  return (
    <div className="story-viewer">
      <div className="story-progress-container">
        {story.images.map((_, index) => (
          <div key={index} className="story-progress-bar">
            <div
              className="story-progress-fill"
              style={{
                width: index < currentIndex ? '100%' :
                       index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      <div className="story-header">
        <img className="story-viewer-avatar" src={profile.avatar} alt={profile.username} />
        <span className="story-viewer-username">{profile.username}</span>
        <span className="story-time">{story.title || '방금'}</span>
        <button className="story-close" onClick={onClose}>
          <Icons.Close />
        </button>
      </div>

      <div className="story-content">
        <img className="story-image" src={story.images[currentIndex]} alt="Story" />
      </div>

      <div className="story-nav story-nav-prev" onClick={handlePrev} />
      <div className="story-nav story-nav-next" onClick={handleNext} />
    </div>
  )
}

// Post Detail 컴포넌트 (인스타그램 스타일)
function PostDetail({ post, profile, onClose, onImageUpdate, onDelete }) {
  const [liked, setLiked] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const imageInputRef = useRef(null)

  // post id 기반 고정 랜덤 좋아요 수 (5000~7000)
  const getRandomLikes = (postId) => {
    let hash = 0
    for (let i = 0; i < postId.length; i++) {
      hash = ((hash << 5) - hash) + postId.charCodeAt(i)
      hash |= 0
    }
    return 5000 + Math.abs(hash) % 2001
  }

  const randomLikes = getRandomLikes(post.id || 'default')

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000 / 60) // 분 단위
    if (diff < 60) return `${diff}분 전`
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
    return `${Math.floor(diff / 1440)}일 전`
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageUpdate(post.id, reader.result)
        setShowImagePicker(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <button className="post-back" onClick={onClose}>
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21v-2z"/>
          </svg>
        </button>
        <span className="post-header-title">게시물</span>
        <div style={{width: 24}} />
      </div>

      <div className="post-detail-content">
        <div className="post-user-row">
          <img className="post-user-avatar" src={profile.avatar} alt={profile.username} />
          <span className="post-user-name">{profile.username}</span>
          <button className="post-more">
            <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>
            </svg>
          </button>
        </div>

        <div className="post-image-container" onClick={() => setShowFullImage(true)}>
          <img className="post-image" src={post.image} alt="Post" />
        </div>

        {showFullImage && (
          <div className="full-image-overlay" onClick={() => setShowFullImage(false)}>
            <img className="full-image" src={post.image} alt="Post" />
          </div>
        )}

        <div className="post-actions">
          <div className="post-actions-left">
            <button className={`post-action ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
              {liked ? (
                <svg fill="#ff3040" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z"/>
                </svg>
              ) : (
                <Icons.Heart />
              )}
            </button>
            <button className="post-action">
              <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>
            <button className="post-action" onClick={() => setShowImagePicker(true)}>
              <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
          </div>
          <button className="post-action" onClick={() => setShowDeleteConfirm(true)}>
            <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="post-likes">
          <span>좋아요 {(randomLikes + (liked ? 1 : 0)).toLocaleString()}개</span>
        </div>

        {post.caption && (
          <div className="post-caption">
            <span className="post-caption-user">{profile.username}</span>
            <span className="post-caption-text">{post.caption}</span>
          </div>
        )}

        <div className="post-time">{formatTime(post.createdAt)}</div>
      </div>

      {showImagePicker && (
        <div className="image-picker-modal" onClick={() => setShowImagePicker(false)}>
          <div className="image-picker-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-picker-header">
              <span>이미지 변경</span>
              <button onClick={() => setShowImagePicker(false)}>
                <Icons.Close />
              </button>
            </div>
            <div className="image-picker-body">
              <button className="image-picker-btn" onClick={() => imageInputRef.current?.click()}>
                <svg fill="currentColor" viewBox="0 0 24 24" width="48" height="48">
                  <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h-5zM5 19l3-4 2 3 3-4 4 5H5z"/>
                </svg>
                <span>사진 선택</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-modal" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <span>게시글 삭제</span>
            </div>
            <div className="delete-confirm-body">
              <p>이 게시글을 삭제할까요?</p>
              <p className="delete-confirm-warning">삭제된 게시글은 복구할 수 없어요.</p>
            </div>
            <div className="delete-confirm-actions">
              <button className="delete-confirm-cancel" onClick={() => setShowDeleteConfirm(false)}>
                취소
              </button>
              <button className="delete-confirm-delete" onClick={() => {
                onDelete(post.id)
                setShowDeleteConfirm(false)
              }}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Image Cropper 컴포넌트
function ImageCropper({ imageSrc, onCrop, onCancel }) {
  const canvasRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const cropSize = 200

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height })
      // 이미지가 crop 영역에 맞게 초기 스케일 설정
      const minScale = Math.max(cropSize / img.width, cropSize / img.height)
      setScale(minScale * 1.2)
    }
    img.src = imageSrc
  }, [imageSrc])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.95 : 1.05
    const minScale = Math.max(cropSize / imageSize.width, cropSize / imageSize.height)
    setScale(prev => Math.max(minScale, Math.min(prev * delta, 5)))
  }

  const handleCrop = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    // 고해상도 출력 (Retina 대응)
    const outputSize = 400
    const displaySize = 200

    canvas.width = outputSize
    canvas.height = outputSize

    const img = new Image()
    img.onload = () => {
      // 고품질 이미지 스무딩 설정
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 원형 클리핑
      ctx.beginPath()
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // 스케일 비율 조정 (displaySize -> outputSize)
      const scaleFactor = outputSize / displaySize
      const scaledWidth = img.width * scale * scaleFactor
      const scaledHeight = img.height * scale * scaleFactor
      const drawX = (outputSize / 2) - (scaledWidth / 2) + (position.x * scaleFactor)
      const drawY = (outputSize / 2) - (scaledHeight / 2) + (position.y * scaleFactor)

      ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight)

      // PNG로 내보내기
      const croppedImage = canvas.toDataURL('image/png', 1.0)
      onCrop(croppedImage)
    }
    img.src = imageSrc
  }

  return (
    <div className="cropper-modal">
      <div className="cropper-header">
        <button className="cropper-cancel" onClick={onCancel}>취소</button>
        <span className="cropper-title">프로필 사진</span>
        <button className="cropper-confirm" onClick={handleCrop}>완료</button>
      </div>

      <div
        className="cropper-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="cropper-image-wrapper"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <img src={imageSrc} alt="Crop" draggable={false} />
        </div>
        <div className="cropper-overlay">
          <div className="cropper-circle" />
        </div>
      </div>

      <div className="cropper-zoom">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>−</button>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
        <button onClick={() => setScale(s => Math.min(3, s + 0.1))}>+</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

// Settings 컴포넌트
function Settings({ profile, onClose, onProfileUpdate }) {
  const fileInputRef = useRef(null)
  const [cropImage, setCropImage] = useState(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCropImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImage) => {
    onProfileUpdate({ ...profile, avatar: croppedImage })
    setCropImage(null)
  }

  if (cropImage) {
    return (
      <ImageCropper
        imageSrc={cropImage}
        onCrop={handleCropComplete}
        onCancel={() => setCropImage(null)}
      />
    )
  }

  return (
    <div className="settings-modal">
      <div className="settings-header">
        <button className="settings-back" onClick={onClose}>
          <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21v-2z"/>
          </svg>
        </button>
        <span className="settings-title">설정</span>
        <div style={{width: 24}} />
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="settings-avatar-section" onClick={() => fileInputRef.current?.click()}>
            <img className="settings-avatar" src={profile.avatar} alt="Profile" />
            <span className="settings-avatar-edit">프로필 사진 변경</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </div>

        <div className="settings-section">
          <div className="settings-item">
            <span className="settings-label">이름</span>
            <span className="settings-value">{profile.name}</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">사용자 이름</span>
            <span className="settings-value">{profile.username}</span>
          </div>
          <div className="settings-item">
            <span className="settings-label">소개</span>
            <span className="settings-value">{profile.bio}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('grid')
  const [selectedHighlight, setSelectedHighlight] = useState(null)
  const [selectedPostIndex, setSelectedPostIndex] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ara-profile')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...PROFILE, avatar: parsed.avatar || PROFILE.avatar }
    }
    return PROFILE
  })

  // 로컬 posts.json에서 게시물 가져오기
  const fetchPosts = async () => {
    try {
      const res = await fetch('/posts/posts.json')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (e) {
      console.error('Failed to fetch posts:', e)
    }
  }

  // 초기 로드 및 파일 변경 감지용 폴링
  useEffect(() => {
    fetchPosts()
    const interval = setInterval(fetchPosts, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleProfileUpdate = (newProfile) => {
    setProfile(newProfile)
    localStorage.setItem('ara-profile', JSON.stringify(newProfile))
  }

  const handleImageUpdate = async (postId, newImageData) => {
    try {
      // Electron의 IPC를 통해 이미지 저장
      if (window.electronAPI?.savePostImage) {
        const result = await window.electronAPI.savePostImage(postId, newImageData)
        if (result.success) {
          // posts 새로고침
          fetchPosts()
        }
      } else {
        // 웹 환경에서는 로컬 상태만 업데이트
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, image: newImageData } : p))
      }
    } catch (e) {
      console.error('Failed to update image:', e)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      if (window.electronAPI?.deletePost) {
        const result = await window.electronAPI.deletePost(postId)
        if (result.success) {
          setSelectedPostIndex(null)
          fetchPosts()
        }
      } else {
        // 웹 환경에서는 로컬 상태만 업데이트
        setPosts(prev => prev.filter(p => p.id !== postId))
        setSelectedPostIndex(null)
      }
    } catch (e) {
      console.error('Failed to delete post:', e)
    }
  }

  return (
    <div className="app">
      <Header
        username={profile.username}
        onSettingsClick={() => setShowSettings(true)}
      />

      <ProfileHeader profile={{...profile, posts: posts.length}} />

      <Highlights
        highlights={HIGHLIGHTS}
        onHighlightClick={setSelectedHighlight}
      />

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <Gallery
        posts={posts}
        onPostClick={setSelectedPostIndex}
      />

      <BottomNav />

      {selectedHighlight && (
        <StoryViewer
          story={selectedHighlight}
          profile={profile}
          onClose={() => setSelectedHighlight(null)}
        />
      )}

      {selectedPostIndex !== null && posts[selectedPostIndex] && (
        <PostDetail
          post={posts[selectedPostIndex]}
          profile={profile}
          onClose={() => setSelectedPostIndex(null)}
          onImageUpdate={handleImageUpdate}
          onDelete={handleDeletePost}
        />
      )}

      {showSettings && (
        <Settings
          profile={profile}
          onClose={() => setShowSettings(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}

export default App

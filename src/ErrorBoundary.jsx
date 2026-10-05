import { Component } from 'react';

// Bắt lỗi để không bao giờ ra màn hình đen trống: hiện lý do + nút tải lại.
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error('[HCM web]', error); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: '#2a0907', color: '#f6e2b8', padding: 32, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', color: '#f1c94a', marginBottom: 12 }}>{this.props.title || 'Có lỗi khi hiển thị'}</h2>
          <p style={{ opacity: 0.85, marginBottom: 16 }}>Thử tải lại trang. Nếu vẫn lỗi, chụp dòng bên dưới gửi lại để sửa.</p>
          <code style={{ display: 'block', background: '#1a0505', padding: 12, borderRadius: 8, fontSize: 13, wordBreak: 'break-word' }}>{String(this.state.error?.message || this.state.error)}</code>
          <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => location.reload()}>Tải lại</button>
            {this.props.back && <a href={this.props.back} style={{ color: '#f1c94a' }}>← Về slide</a>}
          </div>
        </div>
      </div>
    );
  }
}

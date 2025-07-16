-- Seed data for ClipWizard
-- This script populates the database with sample data for development

-- Insert sample users
INSERT INTO users (email, name, password_hash, plan, credits_remaining, created_at) VALUES
('john@example.com', 'John Doe', '$2b$10$example_hash_1', 'pro', 100, '2024-01-01 10:00:00'),
('jane@example.com', 'Jane Smith', '$2b$10$example_hash_2', 'free', 5, '2024-01-02 11:00:00'),
('mike@example.com', 'Mike Johnson', '$2b$10$example_hash_3', 'pro', 75, '2024-01-03 12:00:00'),
('sarah@example.com', 'Sarah Wilson', '$2b$10$example_hash_4', 'free', 3, '2024-01-04 13:00:00'),
('admin@clipwizard.com', 'Admin User', '$2b$10$example_hash_admin', 'admin', 999, '2024-01-01 09:00:00');

-- Insert sample videos
INSERT INTO videos (user_id, title, original_filename, file_path, file_size, duration, status, created_at) VALUES
(1, 'Marketing Strategy Deep Dive', 'marketing_strategy.mp4', '/uploads/videos/marketing_strategy.mp4', 157286400, 1800, 'completed', '2024-01-15 14:00:00'),
(1, 'Product Launch Presentation', 'product_launch.mp4', '/uploads/videos/product_launch.mp4', 209715200, 2400, 'completed', '2024-01-14 15:00:00'),
(2, 'Team Meeting Highlights', 'team_meeting.mp4', '/uploads/videos/team_meeting.mp4', 104857600, 900, 'processing', '2024-01-13 16:00:00'),
(3, 'Customer Success Stories', 'customer_stories.mp4', '/uploads/videos/customer_stories.mp4', 314572800, 3600, 'completed', '2024-01-12 17:00:00'),
(3, 'Quarterly Review', 'quarterly_review.mp4', '/uploads/videos/quarterly_review.mp4', 262144000, 2700, 'completed', '2024-01-11 18:00:00');

-- Insert sample clips
INSERT INTO clips (video_id, title, start_time, end_time, file_path, thumbnail_path, download_count, created_at) VALUES
(1, 'Key Strategy Point', 300, 330, '/uploads/clips/strategy_clip_1.mp4', '/uploads/thumbnails/strategy_clip_1.jpg', 12, '2024-01-15 14:30:00'),
(1, 'Market Analysis', 600, 645, '/uploads/clips/strategy_clip_2.mp4', '/uploads/thumbnails/strategy_clip_2.jpg', 8, '2024-01-15 14:35:00'),
(1, 'Action Items', 1200, 1230, '/uploads/clips/strategy_clip_3.mp4', '/uploads/thumbnails/strategy_clip_3.jpg', 15, '2024-01-15 14:40:00'),
(2, 'Product Demo', 180, 240, '/uploads/clips/launch_clip_1.mp4', '/uploads/thumbnails/launch_clip_1.jpg', 25, '2024-01-14 15:30:00'),
(2, 'Feature Highlights', 480, 540, '/uploads/clips/launch_clip_2.mp4', '/uploads/thumbnails/launch_clip_2.jpg', 18, '2024-01-14 15:35:00'),
(4, 'Success Story 1', 120, 180, '/uploads/clips/success_clip_1.mp4', '/uploads/thumbnails/success_clip_1.jpg', 32, '2024-01-12 17:30:00'),
(4, 'Success Story 2', 900, 960, '/uploads/clips/success_clip_2.mp4', '/uploads/thumbnails/success_clip_2.jpg', 28, '2024-01-12 17:35:00');

-- Insert sample processing jobs
INSERT INTO processing_jobs (video_id, job_type, status, progress, created_at) VALUES
(1, 'transcription', 'completed', 100, '2024-01-15 14:05:00'),
(1, 'analysis', 'completed', 100, '2024-01-15 14:15:00'),
(1, 'clipping', 'completed', 100, '2024-01-15 14:25:00'),
(2, 'transcription', 'completed', 100, '2024-01-14 15:05:00'),
(2, 'analysis', 'completed', 100, '2024-01-14 15:15:00'),
(2, 'clipping', 'completed', 100, '2024-01-14 15:25:00'),
(3, 'transcription', 'running', 75, '2024-01-13 16:05:00');

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, stripe_subscription_id, status, plan_name, current_period_start, current_period_end, created_at) VALUES
(1, 'sub_1234567890', 'active', 'pro', '2024-01-01 00:00:00', '2024-02-01 00:00:00', '2024-01-01 10:30:00'),
(3, 'sub_0987654321', 'active', 'pro', '2024-01-03 00:00:00', '2024-02-03 00:00:00', '2024-01-03 12:30:00');

-- Insert sample usage logs
INSERT INTO usage_logs (user_id, action, resource_id, metadata, created_at) VALUES
(1, 'video_upload', 1, '{"filename": "marketing_strategy.mp4", "size": 157286400}', '2024-01-15 14:00:00'),
(1, 'clip_generation', 1, '{"clips_generated": 3}', '2024-01-15 14:30:00'),
(1, 'clip_download', 1, '{"clip_id": 1}', '2024-01-15 15:00:00'),
(2, 'video_upload', 3, '{"filename": "team_meeting.mp4", "size": 104857600}', '2024-01-13 16:00:00'),
(3, 'video_upload', 4, '{"filename": "customer_stories.mp4", "size": 314572800}', '2024-01-12 17:00:00'),
(3, 'clip_generation', 4, '{"clips_generated": 2}', '2024-01-12 17:30:00');

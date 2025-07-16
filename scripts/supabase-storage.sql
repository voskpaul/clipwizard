-- Supabase Storage Setup for ClipWizard
-- Run this in your Supabase SQL editor

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Create storage policies
CREATE POLICY "Users can upload videos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'videos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own videos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'videos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own videos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'videos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own videos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'videos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

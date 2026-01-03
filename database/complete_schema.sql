-- ============================================
-- SCHEMA COMPLETO - CompletMirror.io
-- TODAS LAS TABLAS (48 tablas)
-- ============================================

-- ==========================================
-- 1. CORE TABLES (3 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `owner_email` VARCHAR(255) NOT NULL,
  `subscription_status` VARCHAR(50) DEFAULT 'trial',
  `subscription_plan` VARCHAR(50) DEFAULT 'free',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `organizations` (`id`, `name`, `slug`, `owner_email`, `subscription_status`, `subscription_plan`) 
VALUES (1, 'Demo Salon', 'demo', 'admin@completmirror.io', 'active', 'enterprise');

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `phone` VARCHAR(50),
  `role` VARCHAR(50) DEFAULT 'user',
  `is_active` BOOLEAN DEFAULT TRUE,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (`email`),
  INDEX idx_org (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `salon_config` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `salon_name` VARCHAR(255),
  `salon_address` TEXT,
  `salon_phone` VARCHAR(50),
  `salon_website` VARCHAR(255),
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`),
  INDEX idx_org (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. PROFESSIONALS (2 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `professionals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `specialty` VARCHAR(100),
  `bio` TEXT,
  `years_experience` INT DEFAULT 0,
  `hourly_rate` DECIMAL(10, 2),
  `is_verified` BOOLEAN DEFAULT FALSE,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`),
  INDEX idx_specialty (`specialty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `professional_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `professional_id` INT NOT NULL,
  `reviewer_user_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_professional (`professional_id`),
  INDEX idx_reviewer (`reviewer_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. CREDITS & TRANSACTIONS (4 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `user_credits` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `credits_balance` INT DEFAULT 0,
  `total_earned` INT DEFAULT 0,
  `total_spent` INT DEFAULT 0,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `credit_transactions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` INT NOT NULL,
  `transaction_type` ENUM('purchase', 'usage', 'refund', 'bonus', 'referral') NOT NULL,
  `description` TEXT,
  `status` VARCHAR(50) DEFAULT 'completed',
  `reference_id` VARCHAR(255),
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`),
  INDEX idx_type (`transaction_type`),
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `credit_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `package_name` VARCHAR(100) NOT NULL,
  `credits_amount` INT NOT NULL,
  `price_usd` DECIMAL(10, 2) NOT NULL,
  `discount_percentage` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `referrals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `referrer_user_id` INT NOT NULL,
  `referred_user_id` INT NOT NULL,
  `referral_code` VARCHAR(50) UNIQUE,
  `credits_awarded` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'pending',
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_referrer (`referrer_user_id`),
  INDEX idx_referred (`referred_user_id`),
  INDEX idx_code (`referral_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. COMMENTS & ENGAGEMENT (2 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `comments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `content_type` VARCHAR(100) NOT NULL,
  `content_id` INT NOT NULL,
  `comment_text` TEXT NOT NULL,
  `parent_comment_id` BIGINT DEFAULT NULL,
  `is_approved` BOOLEAN DEFAULT TRUE,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`),
  INDEX idx_content (`content_type`, `content_id`),
  INDEX idx_parent (`parent_comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `likes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `content_type` VARCHAR(100) NOT NULL,
  `content_id` INT NOT NULL,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_like` (`user_id`, `content_type`, `content_id`),
  INDEX idx_content (`content_type`, `content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. CHATBOT & AI (3 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `chatbot_conversations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `conversation_title` VARCHAR(255),
  `is_active` BOOLEAN DEFAULT TRUE,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chatbot_messages` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` BIGINT NOT NULL,
  `sender` ENUM('user', 'assistant') NOT NULL,
  `message_text` TEXT NOT NULL,
  `metadata` JSON,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation (`conversation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chatbot_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500),
  `file_type` VARCHAR(50),
  `file_size_kb` INT,
  `is_processed` BOOLEAN DEFAULT FALSE,
  `organization_id` INT DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. MIRROR & DEVICES (6 tablas) - YA CREADAS
-- ==========================================

-- ==========================================
-- 7. AI CONFIGURATIONS (3 tablas) - YA CREADAS
-- ==========================================

-- ==========================================
-- 8. GAMES (3 tablas) - YA CREADAS
-- ==========================================

-- ==========================================
-- 9. TRAINING (3 tablas) - YA CREADAS
-- ==========================================

-- ==========================================
-- 10. AUDIOBOOKS (4 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `audiobook_chapters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `audiobook_id` INT NOT NULL,
  `chapter_number` INT NOT NULL,
  `chapter_title` VARCHAR(200),
  `audio_url` VARCHAR(500),
  `duration_seconds` INT,
  `start_time_seconds` INT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_audiobook (`audiobook_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_audiobook_progress` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `audiobook_id` INT NOT NULL,
  `organization_id` INT DEFAULT 1,
  `current_chapter_id` INT,
  `current_position_seconds` INT DEFAULT 0,
  `total_listened_seconds` INT DEFAULT 0,
  `playback_speed` DECIMAL(2, 1) DEFAULT 1.0,
  `is_favorite` BOOLEAN DEFAULT FALSE,
  `completed` BOOLEAN DEFAULT FALSE,
  `last_listened_at` DATETIME,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_audiobook` (`user_id`, `audiobook_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audiobook_bookmarks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `audiobook_id` INT NOT NULL,
  `chapter_id` INT,
  `position_seconds` INT NOT NULL,
  `note` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_audiobook (`user_id`, `audiobook_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 11. FITNESS (5 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `fitness_programs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `program_key` VARCHAR(50) UNIQUE NOT NULL,
  `program_name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `total_days` INT DEFAULT 5,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `target_area` VARCHAR(50),
  `equipment_needed` JSON DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fitness_workouts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `program_id` INT NOT NULL,
  `day_number` INT NOT NULL,
  `workout_name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `estimated_duration_minutes` INT,
  `workout_config` JSON,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_program (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fitness_exercises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `exercise_key` VARCHAR(50) UNIQUE,
  `exercise_name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `muscle_groups` JSON DEFAULT NULL,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced'),
  `demo_video_url` VARCHAR(500),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_fitness_progress` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `program_id` INT NOT NULL,
  `organization_id` INT DEFAULT 1,
  `current_day` INT DEFAULT 1,
  `workouts_completed` JSON DEFAULT NULL,
  `total_workouts` INT DEFAULT 0,
  `total_exercise_minutes` INT DEFAULT 0,
  `started_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_workout_at` DATETIME,
  `status` ENUM('active', 'completed', 'paused') DEFAULT 'active',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_program (`user_id`, `program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fitness_session_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `workout_id` INT,
  `exercise_id` INT NOT NULL,
  `organization_id` INT DEFAULT 1,
  `reps_completed` INT,
  `sets_completed` INT,
  `form_score` INT,
  `ai_feedback` JSON,
  `duration_seconds` INT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 12. EXPERTS & CONSULTATIONS (4 tablas)
-- ==========================================

CREATE TABLE IF NOT EXISTS `consultations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `requester_user_id` INT NOT NULL,
  `expert_id` INT NOT NULL,
  `organization_id` INT DEFAULT 1,
  `consultation_type` ENUM('chat', 'video', 'async') DEFAULT 'chat',
  `subject` VARCHAR(200),
  `description` TEXT,
  `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  `scheduled_at` DATETIME,
  `started_at` DATETIME,
  `completed_at` DATETIME,
  `duration_minutes` INT,
  `price` DECIMAL(10, 2),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_requester (`requester_user_id`),
  INDEX idx_expert (`expert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `consultation_messages` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `consultation_id` BIGINT NOT NULL,
  `sender_user_id` INT NOT NULL,
  `message_type` ENUM('text', 'image', 'video', 'audio') DEFAULT 'text',
  `content` TEXT,
  `media_url` VARCHAR(500),
  `is_read` BOOLEAN DEFAULT FALSE,
  `sent_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_consultation (`consultation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expert_ratings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `consultation_id` BIGINT NOT NULL,
  `expert_id` INT NOT NULL,
  `rater_user_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_expert (`expert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 13 FINANCE (3 tablas) - YA CREADAS
-- ==========================================

-- ============================================
-- FIN DEL SCHEMA COMPLETO
-- Total: ~48 tablas
-- ============================================

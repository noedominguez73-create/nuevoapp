/**
 * Script Simplificado para Migración de Nuevos Módulos
 * Este script crea solo las tablas de los nuevos módulos sin dependencies complejas
 */

const { sequelize } = require('../src/config/database');

async function migrateNewModules() {
    try {
        console.log('═══════════════════════════════════════════════');
        console.log('  MIGRACIÓN SIMPLIFICADA: NUEVOS MÓDULOS');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🔌 Conectando a la base de datos...\n');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida\n');

        console.log('📦 Creando tablas...\n');

        // Crear directamente las tablas con SQL RAW
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS games_catalog (
                id INT AUTO_INCREMENT PRIMARY KEY,
                technical_key VARCHAR(50) UNIQUE NOT NULL,
                public_name VARCHAR(100) NOT NULL,
                description TEXT,
                default_config JSON,
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ games_catalog');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS game_sessions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                game_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                current_level INT DEFAULT 1,
                current_score INT UNSIGNED DEFAULT 0,
                moves_remaining INT,
                time_seconds INT DEFAULT 0,
                board_state JSON,
                game_mode ENUM('normal', 'timed', 'endless') DEFAULT 'normal',
                status ENUM('active', 'game_over', 'abandoned') DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user_game (user_id, game_id, status),
                INDEX idx_organization (organization_id)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ game_sessions');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS game_leaderboards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                game_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                final_score INT UNSIGNED NOT NULL,
                game_mode VARCHAR(20) NOT NULL,
                duration_seconds INT,
                achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_ranking (game_id, game_mode, final_score DESC),
                INDEX idx_user (user_id)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ game_leaderboards\n');

        // Training
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS training_programs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                program_key VARCHAR(50) UNIQUE NOT NULL,
                program_name VARCHAR(150) NOT NULL,
                description TEXT,
                total_days INT DEFAULT 17,
                lesson_duration_minutes INT DEFAULT 5,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ training_programs');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS training_lessons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                program_id INT NOT NULL,
                day_number INT NOT NULL,
                lesson_title VARCHAR(200) NOT NULL,
                lesson_content TEXT,
                duration_minutes INT DEFAULT 5,
                exercises JSON,
                success_criteria JSON,
                order_index INT DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_program_day (program_id, day_number)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ training_lessons');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS user_training_progress (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                program_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                current_day INT DEFAULT 1,
                lessons_completed JSON,
                total_practice_minutes INT DEFAULT 0,
                average_score DECIMAL(5,2) DEFAULT 0,
                started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user_program (user_id, program_id)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ user_training_progress\n');

        // Audiobooks
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS audiobooks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                author VARCHAR(150),
                narrator VARCHAR(150),
                description TEXT,
                category ENUM('business', 'self_help', 'fiction', 'biography', 'other') DEFAULT 'other',
                total_duration_minutes INT,
                cover_image_url VARCHAR(500),
                audio_url VARCHAR(500),
                file_size_mb DECIMAL(10,2),
                is_active BOOLEAN DEFAULT TRUE,
                is_premium BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ audiobooks');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS audiobook_chapters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audiobook_id INT NOT NULL,
                chapter_number INT NOT NULL,
                chapter_title VARCHAR(200),
                audio_url VARCHAR(500),
                duration_seconds INT,
                start_time_seconds INT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_audiobook (audiobook_id, chapter_number)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ audiobook_chapters');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS user_audiobook_progress (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                audiobook_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                current_chapter_id INT,
                current_position_seconds INT DEFAULT 0,
                total_listened_seconds INT DEFAULT 0,
                playback_speed DECIMAL(2,1) DEFAULT 1.0,
                preferred_voice VARCHAR(50),
                is_favorite BOOLEAN DEFAULT FALSE,
                completed BOOLEAN DEFAULT FALSE,
                last_listened_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user_audiobook (user_id, audiobook_id)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ user_audiobook_progress');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS audiobook_bookmarks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                audiobook_id INT NOT NULL,
                chapter_id INT,
                position_seconds INT NOT NULL,
                note TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ audiobook_bookmarks\n');

        // Fitness
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS fitness_programs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                program_key VARCHAR(50) UNIQUE NOT NULL,
                program_name VARCHAR(150) NOT NULL,
                description TEXT,
                total_days INT DEFAULT 5,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                target_area VARCHAR(50),
                equipment_needed JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ fitness_programs');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS fitness_workouts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                program_id INT NOT NULL,
                day_number INT NOT NULL,
                workout_name VARCHAR(150) NOT NULL,
                description TEXT,
                estimated_duration_minutes INT,
                workout_config JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ fitness_workouts');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS fitness_exercises (
                id INT AUTO_INCREMENT PRIMARY KEY,
                exercise_key VARCHAR(50) UNIQUE,
                exercise_name VARCHAR(150) NOT NULL,
                description TEXT,
                muscle_groups JSON,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
                demo_video_url VARCHAR(500),
                key_points JSON,
                form_validation_rules JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ fitness_exercises');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS user_fitness_progress (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                program_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                current_day INT DEFAULT 1,
                workouts_completed JSON,
                total_workouts INT DEFAULT 0,
                total_exercise_minutes INT DEFAULT 0,
                average_form_score DECIMAL(5,2) DEFAULT 0,
                started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_workout_at DATETIME,
                status ENUM('active', 'completed', 'paused') DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ user_fitness_progress');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS fitness_session_logs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                workout_id INT,
                exercise_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                reps_completed INT,
                sets_completed INT,
                form_score INT,
                ai_feedback JSON,
                video_recording_url VARCHAR(500),
                duration_seconds INT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ fitness_session_logs\n');

        // Experts
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS experts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                specialty VARCHAR(100),
                bio TEXT,
                certifications JSON,
                years_experience INT,
                rating DECIMAL(3,2) DEFAULT 0,
                total_consultations INT DEFAULT 0,
                is_available BOOLEAN DEFAULT TRUE,
                hourly_rate DECIMAL(10,2),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user (user_id),
                INDEX idx_specialty (specialty)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ experts');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS consultations (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                requester_user_id INT NOT NULL,
                expert_id INT NOT NULL,
                organization_id INT DEFAULT 1,
                consultation_type ENUM('chat', 'video', 'async') DEFAULT 'chat',
                subject VARCHAR(200),
                description TEXT,
                status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
                scheduled_at DATETIME,
                started_at DATETIME,
                completed_at DATETIME,
                duration_minutes INT,
                price DECIMAL(10,2),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_requester (requester_user_id),
                INDEX idx_expert (expert_id)
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ consultations');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS consultation_messages (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                consultation_id BIGINT NOT NULL,
                sender_user_id INT NOT NULL,
                message_type ENUM('text', 'image', 'video', 'audio') DEFAULT 'text',
                content TEXT,
                media_url VARCHAR(500),
                is_read BOOLEAN DEFAULT FALSE,
                sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ consultation_messages');

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS expert_ratings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                consultation_id BIGINT NOT NULL,
                expert_id INT NOT NULL,
                rater_user_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('   ✓ expert_ratings\n');

        console.log('🎉 ¡Todas las tablas creadas exitosamente!');
        console.log('\n📊 Resumen:');
        console.log('   - Juegos: 3 tablas');
        console.log('   - Entrenamiento IA: 3 tablas');
        console.log('   - Audiolibros: 4 tablas');
        console.log('   - Mirror Fitness: 5 tablas');
        console.log('   - Pregunta al Experto: 4 tablas');
        console.log('   ─────────────────────────');
        console.log('   TOTAL: 19 nuevas tablas\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        console.error('\nDetalles:', error.message);
        if (error.sql) {
            console.error('\nSQL:', error.sql);
        }
        process.exit(1);
    }
}

migrateNewModules();

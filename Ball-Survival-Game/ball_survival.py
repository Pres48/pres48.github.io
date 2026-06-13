import pygame
import random

# Initialize pygame
pygame.init()

# Screen settings
WIDTH = 800
HEIGHT = 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Ball Survival")

# Colors
WHITE = (255, 255, 255)
BLUE = (0, 200, 255)
RED = (255, 0, 0)
BLACK = (0, 0, 0)

# Clock
clock = pygame.time.Clock()

# Paddle
paddle_width = 120
paddle_height = 15
paddle_x = WIDTH // 2 - paddle_width // 2
paddle_y = HEIGHT - 50
paddle_speed = 8

# Ball
ball_size = 20
ball_x = WIDTH // 2
ball_y = HEIGHT // 2
ball_speed_x = 5
ball_speed_y = -5

# Score
score = 0
font = pygame.font.SysFont(None, 40)

# Obstacles
obstacles = []

for i in range(5):
    obstacles.append(
        pygame.Rect(
            random.randint(50, WIDTH - 100),
            random.randint(50, HEIGHT // 2),
            80,
            20
        )
    )

running = True

while running:
    clock.tick(60)

    # Events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Paddle movement
    keys = pygame.key.get_pressed()

    if keys[pygame.K_LEFT]:
        paddle_x -= paddle_speed

    if keys[pygame.K_RIGHT]:
        paddle_x += paddle_speed

    paddle_x = max(0, min(WIDTH - paddle_width, paddle_x))

    paddle = pygame.Rect(
        paddle_x,
        paddle_y,
        paddle_width,
        paddle_height
    )

    # Move ball
    ball_x += ball_speed_x
    ball_y += ball_speed_y

    ball_rect = pygame.Rect(
        ball_x,
        ball_y,
        ball_size,
        ball_size
    )

    # Wall collisions
    if ball_x <= 0 or ball_x >= WIDTH - ball_size:
        ball_speed_x *= -1

    if ball_y <= 0:
        ball_speed_y *= -1

    # Paddle collision
    if ball_rect.colliderect(paddle):
        ball_speed_y *= -1

    # Obstacle collisions
    for obstacle in obstacles:
        if ball_rect.colliderect(obstacle):
            ball_speed_y *= -1

    # Lose condition
    if ball_y > HEIGHT:
        running = False

    # Score increases over time
    score += 1

    # Ball gets faster every 500 points
    if score % 500 == 0:
        if ball_speed_x > 0:
            ball_speed_x += 1
        else:
            ball_speed_x -= 1

        if ball_speed_y > 0:
            ball_speed_y += 1
        else:
            ball_speed_y -= 1

    # Draw everything
    screen.fill(BLACK)

    pygame.draw.rect(screen, BLUE, paddle)

    pygame.draw.circle(
        screen,
        WHITE,
        (int(ball_x + ball_size / 2),
         int(ball_y + ball_size / 2)),
        ball_size // 2
    )

    for obstacle in obstacles:
        pygame.draw.rect(screen, RED, obstacle)

    score_text = font.render(
        f"Score: {score}",
        True,
        WHITE
    )

    screen.blit(score_text, (10, 10))

    pygame.display.flip()

pygame.quit()

print("Game Over!")
print("Final Score:", score)
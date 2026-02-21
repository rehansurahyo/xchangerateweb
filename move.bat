@echo off
mkdir src\app\app
move src\app\dashboard src\app\app\dashboard
move src\app\api-config src\app\app\sessions
move src\app\community src\app\app\community
move src\app\leaderboard src\app\app\leaderboard
move src\app\performance src\app\app\performance
move src\app\billing src\app\app\billing
move src\app\settings src\app\app\settings
move src\app\profile src\app\app\profile
move src\app\admin src\app\app\admin
mkdir src\app\app\sessions\new
mkdir src\app\app\sessions\[id]
echo Done

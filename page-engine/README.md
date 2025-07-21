# PAGE Engine

```
██████╗  █████╗  ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝ ██╔════╝
██████╔╝███████║██║  ███╗█████╗  
██╔═══╝ ██╔══██║██║   ██║██╔══╝  
██║     ██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                                 
Prime Advanced Game Engine
```

## Overview

PAGE (Prime Advanced Game Engine) is a modern, high-performance game engine built with C++20. Designed for both 2D and 3D game development, PAGE provides a comprehensive suite of tools and systems to create cutting-edge games across multiple platforms.

## ⚠️ Development Status

**This project is in heavy development and is not ready for production use.**

Features, APIs, and architecture are subject to significant changes. Use at your own risk.

## Core Features

### Engine Architecture
- **Modern C++20** codebase with cutting-edge language features
- **Cross-platform** support (Windows, Linux, macOS)
- **Modular design** with clear separation of concerns
- **High-performance** memory management and optimization

### Graphics & Rendering
- **OpenGL 4.6** and **Vulkan** rendering backends
- **Deferred rendering** pipeline
- **PBR (Physically Based Rendering)** materials
- **Real-time shadows** and lighting
- **Post-processing** effects
- **Level-of-Detail (LOD)** system

### Game Systems
- **Entity Component System (ECS)** architecture
- **Advanced physics** simulation with Bullet Physics
- **3D audio** with OpenAL
- **Asset streaming** and management
- **Multi-threaded** job system

### Development Tools
- **Hot-reload** for shaders and assets
- **Profiling** and debugging tools
- **Scene editor** (planned)
- **Material editor** (planned)

## Supported Platforms

PAGE is designed to build and compile on all major PC platforms:

- **Windows** (DirectX 11/12, OpenGL, Vulkan)
- **Linux** (OpenGL, Vulkan)
- **macOS** (OpenGL, Metal planned)
- **FreeBSD** (OpenGL, Vulkan)

Cross-compilation support ensures consistent builds across all platforms.

## Technology Stack

| Component | Technology |
|-----------|------------|
| Language | C++20 |
| Graphics | OpenGL 4.6, Vulkan |
| Physics | Bullet Physics |
| Audio | OpenAL |
| Math | GLM |
| Windowing | GLFW |
| Asset Loading | Assimp, stb_image |
| Build System | CMake |
| Logging | spdlog |

## Getting Started

### Prerequisites
- C++20 compatible compiler (GCC 10+, Clang 10+, MSVC 19.29+)
- CMake 3.20+
- OpenGL 4.6+ compatible GPU
- Vulkan SDK (optional)

### Building
```bash
git clone https://github.com/mononeer/PAGE.git
cd PAGE
mkdir build
cd build
cmake ..
make -j$(nproc)
```

### Quick Example
```cpp
#include <PAGE/Core/Engine.h>
#include <PAGE/Renderer/Camera.h>
#include <PAGE/ECS/Entity.h>

int main() {
    PAGE::Engine engine;
    engine.Initialize();
    
    // Create a simple scene
    auto camera = engine.CreateEntity();
    camera.AddComponent<PAGE::Camera>();
    
    // Game loop
    while (engine.IsRunning()) {
        engine.Update();
        engine.Render();
    }
    
    engine.Shutdown();
    return 0;
}
```

## Architecture Overview

PAGE follows a modern ECS (Entity Component System) architecture:

```
┌─────────────────┐
│   Application   │
├─────────────────┤
│   Game Logic    │
├─────────────────┤
│   ECS Systems   │
├─────────────────┤
│  Engine Core    │
├─────────────────┤
│   Subsystems    │
│ ┌─────┬─────────┐│
│ │Render│Physics ││
│ ├─────┼─────────┤│
│ │Audio │Input   ││
│ └─────┴─────────┘│
└─────────────────┘
```

## Performance Features

- **Frustum culling** for efficient rendering
- **Octree spatial partitioning** for collision detection
- **Memory pools** for allocation optimization
- **Multi-threaded** rendering and physics
- **Asset streaming** for large worlds
- **Batch rendering** for optimal draw calls

## Copyright & License

**PAGE Engine** is the original and only engine called PAGE.

Created by **@mononeer**

Licensed under the **PAGE Engine License v1.0** - A custom license that allows free, non-commercial use only.

**Key License Terms:**
- ✅ Free for personal, educational, and non-commercial use
- ✅ Create and distribute games for free
- ❌ No commercial use or monetization allowed
- ❌ Games created must remain free forever

See [LICENSE](LICENSE) for full license text.

## Disclaimer

This engine is in active development. APIs, features, and architecture are subject to breaking changes. The engine is not recommended for production use at this time.

---

*Prime Advanced Game Engine - Built for the future of game development*
